# SauceDemo regression test plan

## Scope and quality risks

The tests cover the public SauceDemo shopping flow. Important risks are incorrect authentication, incorrect cart state, product order, missing checkout validation, and incorrect order confirmation.

## Scenarios

### Authentication
1. Standard user can sign in and sees `Products`.
2. Invalid credentials show an actionable error and do not navigate into inventory.
3. Locked-out user is denied access.
4. Missing username or password is rejected.
5. A signed-in user can log out.

### Inventory and cart
6. Six catalog items load for a standard user.
7. Sort by price (low to high) yields nondecreasing visible prices.
8. Adding a product increases the cart badge; removing it clears the badge.
9. Two selected products appear in the cart.
10. Removing one product keeps the other.
11. Navigating between cart and inventory preserves items.

### Checkout
12. Standard user can complete an order and sees a success message.
13. Checkout rejects missing first name.
14. Checkout rejects missing last name.
15. Checkout rejects missing postal code.
16. Canceling checkout returns to the cart without placing an order.

## Agentic expansion ideas (not already tested)

- Explore accessibility and keyboard workflows.
- Test session expiration if the application supports it.
- Check responsive layouts with mobile viewport projects.
- Explore failure-mode messaging and network interruptions only if realistic controlled test hooks exist.

## Exit criteria

- Tests use meaningful behavior assertions, not only URL or element-presence checks.
- No `test.only`, unconditional skips, or fixed sleeps.
- No test data or authentication state leaks between independent test runs.
- Changes pass type checks and local/CI runs before being accepted.
