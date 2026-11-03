/** SauceDemo intentionally publishes these credentials for demo/testing purposes. */
export const users = {
  standard: {
    username: process.env.SAUCE_USERNAME ?? 'standard_user',
    password: process.env.SAUCE_PASSWORD ?? 'secret_sauce',
  },
  lockedOut: { username: 'locked_out_user', password: 'secret_sauce' },
} as const;

export const products = {
  backpack: 'Sauce Labs Backpack',
  bikeLight: 'Sauce Labs Bike Light',
  boltTShirt: 'Sauce Labs Bolt T-Shirt',
} as const;

export const customer = {
  firstName: 'Test',
  lastName: 'Shopper',
  postalCode: '10001',
} as const;
