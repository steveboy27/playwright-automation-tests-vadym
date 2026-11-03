import { test } from './fixtures';
import { users } from '../test-data/demoData';

/**
 * A small, runnable seed for Playwright's official planner agent. The seed
 * illustrates how to bootstrap the authenticated app state for exploration.
 * This test also runs normally and makes a useful environment health check.
 */
test('agent seed: demo user reaches the inventory page', async ({ loginPage, inventoryPage }) => {
  await loginPage.open();
  await loginPage.login(users.standard.username, users.standard.password);
  await inventoryPage.expectLoaded();
});
