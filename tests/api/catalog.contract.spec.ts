import { test, expect } from '@playwright/test';
import { createServer, type Server } from 'node:http';
import { once } from 'node:events';
import type { AddressInfo } from 'node:net';

/**
 * A small in-process fake catalog API for demonstrating deterministic API
 * contract checks. This is NOT a claim to test SauceDemo's backend API.
 */
const catalog = [
  { id: 1, name: 'Sauce Labs Backpack', price: 29.99 },
  { id: 2, name: 'Sauce Labs Bike Light', price: 9.99 },
];

let server: Server;
let endpoint: string;

test.describe('Mock catalog API contracts', () => {
  test.beforeAll(async () => {
    server = createServer(async (req, res) => {
      const url = new URL(req.url ?? '/', 'http://localhost');
      res.setHeader('Content-Type', 'application/json; charset=utf-8');

      if (req.method === 'GET' && url.pathname === '/api/products') {
        res.writeHead(200);
        res.end(JSON.stringify({ products: catalog, total: catalog.length }));
        return;
      }

      if (req.method === 'GET' && url.pathname.startsWith('/api/products/')) {
        const id = Number(url.pathname.split('/').at(-1));
        const product = catalog.find((item) => item.id === id);
        res.writeHead(product ? 200 : 404);
        res.end(JSON.stringify(product ?? { error: 'Product not found' }));
        return;
      }

      if (req.method === 'POST' && url.pathname === '/api/products') {
        let body = '';
        for await (const chunk of req) body += chunk.toString();
        let payload: unknown;
        try {
          payload = JSON.parse(body);
        } catch {
          res.writeHead(400);
          res.end(JSON.stringify({ error: 'Invalid JSON' }));
          return;
        }
        const valid = typeof payload === 'object' && payload !== null &&
          'name' in payload && typeof payload.name === 'string' &&
          'price' in payload && typeof payload.price === 'number';
        res.writeHead(valid ? 201 : 400);
        res.end(JSON.stringify(valid ? { id: 3, ...(payload as object) } : { error: 'name and price are required' }));
        return;
      }

      res.writeHead(404);
      res.end(JSON.stringify({ error: 'Not found' }));
    });
    server.listen(0, '127.0.0.1');
    await once(server, 'listening');
    const port = (server.address() as AddressInfo).port;
    endpoint = `http://127.0.0.1:${port}`;
  });

  test.afterAll(async () => {
    if (server) await new Promise<void>((resolve, reject) => server.close((err) => err ? reject(err) : resolve()));
  });

  test('@regression returns catalog with an explicit response contract', async ({ request }) => {
    const response = await request.get(`${endpoint}/api/products`);
    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('application/json');
    const body: unknown = await response.json();
    expect(body).toMatchObject({ total: 2 });
    expect(body).toHaveProperty('products');
    const products = (body as { products: Array<{ id: number; name: string; price: number }> }).products;
    expect(products).toHaveLength(2);
    for (const product of products) {
      expect(product.id).toEqual(expect.any(Number));
      expect(product.name).toEqual(expect.any(String));
      expect(product.price).toBeGreaterThan(0);
    }
  });

  test('@regression returns a 404 for unknown product IDs', async ({ request }) => {
    const response = await request.get(`${endpoint}/api/products/9999`);
    expect(response.status()).toBe(404);
    expect(await response.json()).toEqual({ error: 'Product not found' });
  });

  test('@regression validates required fields for new products', async ({ request }) => {
    const invalid = await request.post(`${endpoint}/api/products`, { data: { name: 'Missing price' } });
    expect(invalid.status()).toBe(400);
    expect(await invalid.json()).toEqual({ error: 'name and price are required' });
  });

  test('@regression rejects invalid JSON safely', async ({ request }) => {
    const invalid = await request.post(`${endpoint}/api/products`, {
      data: '{invalid',
      headers: { 'content-type': 'application/json' },
    });
    expect(invalid.status()).toBe(400);
    expect(await invalid.json()).toEqual({ error: 'Invalid JSON' });
  });
});
