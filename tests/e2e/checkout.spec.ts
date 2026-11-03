import { test } from '../fixtures';
import { customer, products, users } from '../../test-data/demoData';

test.describe('Checkout', () => {
  test.beforeEach(async ({ loginPage, inventoryPage, cartPage }) => {
    await loginPage.open();
    await loginPage.login(users.standard.username, users.standard.password);
    await inventoryPage.expectLoaded();
    await inventoryPage.addItem(products.backpack);
    await inventoryPage.openCart();
    await cartPage.checkout();
  });

  test('@smoke customer completes an order', async ({ checkoutPage }) => {
    await checkoutPage.fillDetails(customer);
    await checkoutPage.continueToOverview();
    await checkoutPage.expectOverviewContains(products.backpack);
    await checkoutPage.finish();
  });

  test('@regression checkout requires first name', async ({ checkoutPage }) => {
    await checkoutPage.expectValidation('First Name is required');
  });

  test('@regression checkout requires last name', async ({ checkoutPage }) => {
    await checkoutPage.firstName.fill(customer.firstName);
    await checkoutPage.expectValidation('Last Name is required');
  });

  test('@regression checkout requires postal code', async ({ checkoutPage }) => {
    await checkoutPage.firstName.fill(customer.firstName);
    await checkoutPage.lastName.fill(customer.lastName);
    await checkoutPage.expectValidation('Postal Code is required');
  });

  test('@regression canceling checkout returns to cart', async ({ checkoutPage, cartPage }) => {
    await checkoutPage.cancel();
    await cartPage.expectProduct(products.backpack);
  });
});
