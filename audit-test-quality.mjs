/**
 * Lightweight human-review guardrails for AI-assisted tests.
 * This is NOT a semantic verifier: review business assertions and actual
 * application behavior manually before accepting generated or healed tests.
 */
import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../tests/', import.meta.url));
const failures = [];
const checks = [
  { regex: /\b(?:test|describe)\.(?:only|skip)\s*\(/g, message: 'Committed exclusive/skipped test' },
  { regex: /\.waitForTimeout\s*\(/g, message: 'Hardcoded wait; use event/locator expectations' },
  { regex: /expect\s*\(\s*true\s*\)\s*\.toBe\s*\(\s*true\s*\)/g, message: 'Tautological assertion' },
  { regex: /process\.env\.(?:OPENAI_API_KEY|ANTHROPIC_API_KEY)\s*\??\s*=/g, message: 'Possible hardcoded agent credential' },
];

async function visit(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) await visit(path);
    else if (entry.name.endsWith('.spec.ts')) {
      const source = await readFile(path, 'utf8');
      for (const { regex, message } of checks) {
        for (const match of source.matchAll(regex)) {
          const line = source.slice(0, match.index).split('\n').length;
          failures.push(`${path}:${line}: ${message}`);
        }
      }
    }
  }
}
await visit(root);
if (failures.length > 0) {
  console.error(failures.join('\n'));
  process.exitCode = 1;
} else {
  console.log('Static test-quality audit passed (manual review still required).');
}
