# Human-reviewed AI-assisted test workflow

This repository implements the **Playwright automation suite**, and documents how to opt into official **Playwright Test Agents**. It does NOT bundle a paid LLM, run an agent silently in CI, or claim that AI-generated tests have been verified.

## 1. Initialize the official agent definitions

After `npm install`, pick an AI coding tool you actually use:

```bash
npx playwright init-agents --loop=claude
# OR
npx playwright init-agents --loop=vscode
# OR
npx playwright init-agents --loop=codex
```

This creates the tool-specific agent definitions using the installed Playwright version. Regenerate them after Playwright upgrades.

Official documentation: https://playwright.dev/docs/test-agents

## 2. Planner: explore and propose coverage

In your AI tool, instruct the `planner` agent:

> Inspect this SauceDemo test project. Use `tests/seed.spec.ts` to establish an authenticated session and read `specs/saucedemo-regression.md`. Propose **five additional high-value scenarios** we have not automated. Explore the live UI to validate that each scenario is possible. Write a Markdown plan under `specs/agent-proposals.md`. Do not edit tests yet. Call out inaccessible pages, assumptions, and risks.

**Human review:** check each proposed scenario against real business behavior before approving it.

## 3. Generator: produce narrow tests

> Using only the approved scenarios in `specs/agent-proposals.md`, generate Playwright TypeScript tests under `tests/e2e/`. Follow existing fixtures and Page Objects. Verify each locator and expected result against the app; do not guess. Avoid test order dependencies, sleep calls, and hardcoded sensitive data. Run the relevant test(s) and report exact results.

**Human review:** verify assertions would actually detect product defects and are not superficial.

## 4. Healer: investigate failures, don't hide them

> Run the named failing Playwright test. Gather its trace, screenshot, and error. Determine whether the failure is caused by the application, a brittle selector, environment or test data. Only propose a test-code change if the application still satisfies the expected business behavior. Show the diff and rerun the narrow test; never weaken an assertion or mark the test skipped to obtain a green run.

**Human review:** review every change in the diff. A passing test does not prove correctness.

## 5. Quality gates

```bash
npm run check
npm run test:chromium
```

Use a PR review for any agent-assisted code. Commit the prompt, plan, review observations, and results if you want to demonstrate provenance in a portfolio.

## Agentic features vs regular automation

| Feature | Status |
| --- | --- |
| Playwright TypeScript E2E suite | Included |
| Test plan and agent prompts | Included |
| AI test quality static audit | Included |
| Planner / Generator / Healer definitions | Generated optionally via `init-agents` |
| AI-generated tests verified at runtime | Not claimed |
| Autonomous unattended healing in GitHub Actions | Intentionally not configured |
