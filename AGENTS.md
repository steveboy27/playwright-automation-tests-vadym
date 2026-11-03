# AI agent instructions for this Playwright portfolio

- Read `README.md`, `docs/AI_WORKFLOW.md`, and `specs/saucedemo-regression.md` first.
- Follow the official Playwright **planner → generator → healer** workflow.
- Do not treat this file as runnable AI automation. Initialize the official agent definitions using the README commands.
- Never invent DOM selectors, asserted outcomes, backend endpoints, or test results. Inspect the live application when authorized and able.
- Prefer accessible roles and `data-test` IDs; avoid brittle CSS and positional indices.
- Keep tests independent and deterministic; do not depend on another test's browser state.
- Write a failing test for a confirmed defect; never weaken assertions to make a run green.
- Before changing an existing test, document the failure category: application, automation, environment, or test data.
- Redact logs, traces, screenshots and bug reports if they contain personal data or secrets.
- Agent-generated code must pass `npm run check` and the relevant Playwright tests, followed by human review.
- Do not auto-merge or bypass a failing quality gate.
