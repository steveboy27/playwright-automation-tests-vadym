# Playwright Automation Framework — TypeScript + AI Test Agents

![Playwright](https://img.shields.io/badge/Playwright-TypeScript-2EAD33?logo=playwright&logoColor=white)
![GitHub Actions](https://img.shields.io/badge/CI-GitHub%20Actions-2088FF?logo=githubactions&logoColor=white)
![QA](https://img.shields.io/badge/Testing-UI%20%7C%20API%20%7C%20E2E-444444)

A modern **Playwright + TypeScript QA automation portfolio** for [SauceDemo](https://www.saucedemo.com/). Reimagines the workflow coverage in my [original Cypress project](https://github.com/steveboy27/cypress-automation-tests-vadym) while adding cross-browser testing, strongly typed Page Objects, repeatable CI, HTML reports, and an **optional human-reviewed agentic workflow**.

> **Project status:** Ready for local dependency installation and execution; live runs against SauceDemo have not yet been verified in the environment used to assemble this starter. See [Verification](#verification-and-limitations).

## Test coverage

| Area | Examples |
| --- | --- |
| Login | successful login, invalid/locked-out accounts, required fields, logout |
| Inventory | six products, price sorting, add/remove cart items |
| Cart | two items, remove one, retain state while navigating |
| Checkout | happy path, required field validation, cancel checkout |
| Agent seed | authenticated page initialization for the official Planner agent |
| API | a controlled **local mock service** contract exercise; not SauceDemo's real backend |

All E2E tests run against SauceDemo's public **demo** application. Each test gets an isolated browser context and creates its own state.

## Stack

- Playwright Test 1.64.1 + TypeScript (Node.js 20+)
- Page Object Model + typed fixtures + reusable data
- Chromium, Firefox, WebKit projects
- Built-in Playwright HTML reporting, traces, screenshots, and failure video
- GitHub Actions with independent browser jobs and review checks
- Optional official Playwright **Planner, Generator, Healer** agents

## Get started

Prerequisites: Node.js 20+ and npm, and internet to install dependencies and browsers.

```bash
npm install
npx playwright install
npm test
```

Useful commands:

```bash
npm run test:smoke       # small Chromium smoke suite
npm run test:regression  # scenarios tagged @regression
npm run test:headed      # Chromium browser visible
npm run test:ui          # interactive debugging
npm run test:api         # controlled mock API examples
npm run check            # TypeScript + review guardrails
npm run report           # open HTML report after a run
```

When you run `npm install`, commit the generated `package-lock.json` to the repository. This starter workflow uses `npm install` so the first CI run works even before a lockfile is committed; for more reproducible builds, switch CI to `npm ci` once the lockfile is committed.

## Architecture

```text
playwright-automation-tests-vadym/
├── .github/workflows/playwright.yml   # Type checks + Chromium/Firefox CI
├── AGENTS.md                           # Constraints for AI assistants
├── docs/AI_WORKFLOW.md                 # Planner → Generator → Healer steps
├── pages/                              # Typed Page Object Model
│   ├── LoginPage.ts
│   ├── InventoryPage.ts
│   ├── CartPage.ts
│   └── CheckoutPage.ts
├── scripts/audit-test-quality.mjs      # Rejects obvious weak test patterns
├── specs/saucedemo-regression.md       # Human-readable regression plan
├── test-data/demoData.ts               # Public demo fixtures
├── tests/
│   ├── fixtures.ts                     # Page objects per test
│   ├── seed.spec.ts                     # Agent exploration seed
│   ├── api/                             # Local mock API examples
│   └── e2e/                             # Login, inventory, cart, checkout
├── playwright.config.ts
├── package.json
└── tsconfig.json
```

## CI and failure evidence

On pull requests and `main`, the workflow installs dependencies, type-checks, audits risky test patterns, runs Playwright against Chromium and Firefox, and uploads HTML reports and traces. WebKit is available locally with `npm run test:webkit`.

- Screenshots: retained on failures.
- Video: retained on failures.
- Traces: collected on the first retry in CI.
- CI retries: one retry to support diagnostics, **not** a substitute for fixing flaky tests.

## Playwright Test Agents (optional)

The project includes an agent-ready **seed test**, human-readable test plan, AI usage guidance, and review guardrails. The actual agent definitions are installed on demand:

```bash
npx playwright init-agents --loop=claude
```

Other supported loops include `--loop=vscode` and `--loop=codex`. See [docs/AI_WORKFLOW.md](docs/AI_WORKFLOW.md) for usable Planner, Generator and Healer prompts.

**Important:** agents can suggest test code or repairs, but an engineer must review every expected behavior and assertion. The portfolio does not claim that an autonomous agent created, repaired, or successfully ran any test.

Official docs: https://playwright.dev/docs/test-agents

## Verification and limitations

- The repository is based on the publicly documented workflows in the original Cypress project.
- Automated tests and Playwright TypeScript files were **not executed against SauceDemo** when initially assembled; install dependencies, run and verify locators before marking the suite verified.
- The API contract sample runs against a **locally launched mock HTTP server** and does not demonstrate testing a proprietary SauceDemo backend.
- SauceDemo's own site and UI may change, requiring locator updates after inspection.
- Public demo credentials are stored only in `test-data/demoData.ts`; override them with `SAUCE_USERNAME` and `SAUCE_PASSWORD` where appropriate. Never put real production credentials in this project.

## Resume-friendly summary (after you personally run and verify)

> Built a Playwright/TypeScript E2E automation portfolio for SauceDemo covering login, catalog, cart and checkout, with cross-browser CI, typed Page Objects, debugging artifacts and a human-reviewed AI-agent testing workflow.

Do not claim production usage, real customer impact, or test execution results unless you can demonstrate them.

## Attribution

The original Cypress project was created by Vadym and served as inspiration for this independent Playwright implementation. SauceDemo and its product names are third-party demo content used for educational testing.

## License

[MIT](LICENSE).
