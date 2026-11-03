import { expect, type Locator, type Page } from '@playwright/test';

export type Customer = { firstName: string; lastName: string; postalCode: string };

export class CheckoutPage {
  readonly firstName: Locator;
  readonly lastName: Locator;
  readonly postalCode: Locator;
  readonly continueButton: Locator;
  readonly error: Locator;

  constructor(private readonly page: Page) {
    this.firstName = page.getByTestId('firstName');
    this.lastName = page.getByTestId('lastName');
    this.postalCode = page.getByTestId('postalCode');
    this.continueButton = page.getByTestId('continue');
    this.error = page.getByTestId('error');
  }

  async fillDetails(customer: Customer): Promise<void> {
    await this.firstName.fill(customer.firstName);
    await this.lastName.fill(customer.lastName);
    await this.postalCode.fill(customer.postalCode);
  }

  async continueToOverview(): Promise<void> {
    await this.continueButton.click();
    await expect(this.page).toHaveURL(/checkout-step-two\.html$/);
  }

  async expectValidation(message: string): Promise<void> {
    await this.continueButton.click();
    await expect(this.error).toContainText(message);
  }

  async expectOverviewContains(name: string): Promise<void> {
    await expect(this.page.locator('.cart_item').filter({ hasText: name })).toBeVisible();
  }

  async finish(): Promise<void> {
    await this.page.getByTestId('finish').click();
    await expect(this.page.getByTestId('complete-header')).toHaveText('Thank you for your order!');
  }

  async cancel(): Promise<void> {
    await this.page.getByTestId('cancel').click();
    await expect(this.page).toHaveURL(/cart\.html$/);
  }
}
