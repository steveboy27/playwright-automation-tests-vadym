import { expect, type Locator, type Page } from '@playwright/test';

export class CartPage {
  readonly items: Locator;
  readonly checkoutButton: Locator;

  constructor(private readonly page: Page) {
    this.items = page.locator('.cart_item');
    this.checkoutButton = page.getByTestId('checkout');
  }

  async expectProduct(name: string): Promise<void> {
    await expect(this.items.filter({ hasText: name })).toHaveCount(1);
  }

  async expectItemCount(count: number): Promise<void> {
    await expect(this.items).toHaveCount(count);
  }

  async removeProduct(name: string): Promise<void> {
    await this.items.filter({ hasText: name }).getByRole('button', { name: /remove/i }).click();
  }

  async continueShopping(): Promise<void> {
    await this.page.getByTestId('continue-shopping').click();
    await expect(this.page).toHaveURL(/inventory\.html$/);
  }

  async checkout(): Promise<void> {
    await this.checkoutButton.click();
    await expect(this.page).toHaveURL(/checkout-step-one\.html$/);
  }
}
