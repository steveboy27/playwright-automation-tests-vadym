import { expect, type Locator, type Page } from '@playwright/test';

export class InventoryPage {
  readonly items: Locator;
  readonly cartLink: Locator;
  readonly cartBadge: Locator;
  readonly sort: Locator;

  constructor(private readonly page: Page) {
    this.items = page.locator('.inventory_item');
    this.cartLink = page.locator('.shopping_cart_link');
    this.cartBadge = page.locator('.shopping_cart_badge');
    this.sort = page.getByTestId('product-sort-container');
  }

  async expectLoaded(): Promise<void> {
    await expect(this.page.getByTestId('title')).toHaveText('Products');
    await expect(this.items).toHaveCount(6);
  }

  /** Scope controls to the product card, avoiding fragile list indices. */
  private itemNamed(name: string): Locator {
    return this.items.filter({ has: this.page.getByText(name, { exact: true }) });
  }

  async addItem(name: string): Promise<void> {
    await this.itemNamed(name).getByRole('button', { name: /add to cart/i }).click();
  }

  async removeItem(name: string): Promise<void> {
    await this.itemNamed(name).getByRole('button', { name: /remove/i }).click();
  }

  async expectCartCount(count: number): Promise<void> {
    if (count === 0) {
      await expect(this.cartBadge).toHaveCount(0);
    } else {
      await expect(this.cartBadge).toHaveText(String(count));
    }
  }

  async openCart(): Promise<void> {
    await this.cartLink.click();
    await expect(this.page).toHaveURL(/cart\.html$/);
  }

  async sortByPriceAscending(): Promise<void> {
    await this.sort.selectOption('lohi');
  }

  async visiblePrices(): Promise<number[]> {
    const priceTexts = await this.items.locator('.inventory_item_price').allTextContents();
    return priceTexts.map((price) => Number(price.replace('$', '')));
  }

  async logOut(): Promise<void> {
    await this.page.getByRole('button', { name: /open menu/i }).click();
    await this.page.getByTestId('logout-sidebar-link').click();
    await expect(this.page.getByTestId('login-button')).toBeVisible();
  }
}
