# BSA 2025 – Checkly Automation Test

Automated API and UI tests for the Checkly project, developed as part of the Binary Studio Academy 2025 program.

This project uses [Playwright](https://playwright.dev/) to test the functionality of the Checkly backend (and UI in the future).  
Includes Continuous Integration via GitHub Actions and generates HTML test reports as build artifacts.

---

## 📦 Tech Stack

- [Playwright](https://playwright.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Faker](https://www.npmjs.com/package/@faker-js/faker) – fake test data
- [Ajv](https://ajv.js.org/) – schema validation (optional)
- GitHub Actions – CI/CD pipeline

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/VictorVagabculov/BSA-2025-Checkly-Automation-Test.git
cd BSA-2025-Checkly-Automation-Test
```

### 2. Install dependencies

```bash
npm install
```

### 3. Install Playwright browsers

```bash
npx playwright install
```

### 4. Run the tests

```bash
npm test
```

### 5. View the report

```bash
npm run report
# Then open: playwright-report/index.html
```

---

## 🧪 Continuous Integration

On every push or pull request to `main` or `master`, the following happens:

- Dependencies are installed
- Playwright tests are executed
- The HTML report is uploaded as an artifact

🔍 You can download the report from:  
**Actions tab → Latest workflow run → Artifacts → `playwright-report` → Download → open `index.html`**

---

## 📁 Project Structure (simplified)

```
.
├── tests/                # API and UI test suites
├── utils/                # Helpers, data generators, etc.
├── controllers/          # API controllers (optional)
├── .github/workflows/    # CI configuration (playwright.yml)
├── playwright.config.ts  # Playwright test config
├── .prettierrc           # Code formatting rules
└── package.json
```

---

## ✅ TODO

- [ ] Add actual API test cases (auth, users, books, etc.)
- [ ] Setup test data fixtures
- [ ] Add shared steps for auth and user flows
- [ ] Prepare UI tests (optional)

---

## 👤 Author

Victor Vagabculov  
Binary Studio Academy 2025  
[GitHub Profile](https://github.com/VictorVagabculov)
