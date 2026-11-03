import { test, expect } from '../fixtures';
import { products, users } from '../../test-data/demoData';

test.describe('Inventory', () => {
  test.beforeEach(async ({ loginPage, inventoryPage }) => {
    await loginPage.open();
    await loginPage.login(users.standard.username, users.standard.password);
    await inventoryPage.expectLoaded();
  });

  test('@regression inventory lists expected products', async ({ inventoryPage, page }) => {
    await expect(page.getByText(products.backpack, { exact: true })).toBeVisible();
    await expect(page.getByText(products.bikeLight, { exact: true })).toBeVisible();
    await expect(inventoryPage.items).toHaveCount(6);
  });

  test('@regression users can sort products by ascending price', async ({ inventoryPage }) => {
    await inventoryPage.sortByPriceAscending();
    const prices = await inventoryPage.visiblePrices();
    expect(prices.length).toBeGreaterThan(1);
    expect(prices).toEqual([...prices].sort((a, b) => a - b));
  });

  test('@smoke add and remove an item from the cart', async ({ inventoryPage }) => {
    await inventoryPage.addItem(products.backpack);
    await inventoryPage.expectCartCount(1);
    await inventoryPage.removeItem(products.backpack);
    await inventoryPage.expectCartCount(0);
  });
});
