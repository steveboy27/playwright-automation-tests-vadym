import { test } from '../fixtures';
import { products, users } from '../../test-data/demoData';

test.describe('Shopping cart', () => {
  test.beforeEach(async ({ loginPage, inventoryPage }) => {
    await loginPage.open();
    await loginPage.login(users.standard.username, users.standard.password);
    await inventoryPage.expectLoaded();
  });

  test('@smoke cart contains selected inventory items', async ({ inventoryPage, cartPage }) => {
    await inventoryPage.addItem(products.backpack);
    await inventoryPage.addItem(products.bikeLight);
    await inventoryPage.expectCartCount(2);
    await inventoryPage.openCart();
    await cartPage.expectItemCount(2);
    await cartPage.expectProduct(products.backpack);
    await cartPage.expectProduct(products.bikeLight);
  });

  test('@regression removing one cart item keeps the other', async ({ inventoryPage, cartPage }) => {
    await inventoryPage.addItem(products.backpack);
    await inventoryPage.addItem(products.bikeLight);
    await inventoryPage.openCart();
    await cartPage.removeProduct(products.backpack);
    await cartPage.expectItemCount(1);
    await cartPage.expectProduct(products.bikeLight);
    await inventoryPage.expectCartCount(1);
  });

  test('@regression items persist when returning to shopping', async ({ inventoryPage, cartPage }) => {
    await inventoryPage.addItem(products.bikeLight);
    await inventoryPage.openCart();
    await cartPage.continueShopping();
    await inventoryPage.expectCartCount(1);
    await inventoryPage.openCart();
    await cartPage.expectProduct(products.bikeLight);
  });
});
