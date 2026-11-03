import { test, expect } from '../fixtures';
import { users } from '../../test-data/demoData';

test.describe('Login', () => {
  test.beforeEach(async ({ loginPage }) => { await loginPage.open(); });

  test('@smoke standard user can log in', async ({ loginPage, inventoryPage }) => {
    await loginPage.login(users.standard.username, users.standard.password);
    await inventoryPage.expectLoaded();
  });

  test('@regression rejects incorrect credentials', async ({ loginPage }) => {
    await loginPage.login('invalid_demo_user', 'wrong_password');
    await loginPage.expectError('Username and password do not match');
  });

  test('@regression locked-out account gets a clear error', async ({ loginPage }) => {
    await loginPage.login(users.lockedOut.username, users.lockedOut.password);
    await loginPage.expectError('Sorry, this user has been locked out');
  });

  test('@regression username is required', async ({ loginPage }) => {
    await loginPage.submit.click();
    await loginPage.expectError('Username is required');
  });

  test('@regression password is required', async ({ loginPage }) => {
    await loginPage.username.fill(users.standard.username);
    await loginPage.submit.click();
    await loginPage.expectError('Password is required');
  });

  test('@regression user can log out', async ({ loginPage, inventoryPage }) => {
    await loginPage.login(users.standard.username, users.standard.password);
    await inventoryPage.expectLoaded();
    await inventoryPage.logOut();
    await expect(loginPage.submit).toBeVisible();
  });
});
