# BSA 2025 – Checkly Automation Test

Automated API and UI tests for the Checkly project, developed as part of the Binary Studio Academy 2025 program.

This project uses [Playwright](https://playwright.dev/) to test both backend and frontend functionality of Checkly.  
Includes Continuous Integration via GitHub Actions and generates HTML test reports as build artifacts.

---

## 📦 Tech Stack

- [Playwright](https://playwright.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Faker](https://www.npmjs.com/package/@faker-js/faker) – fake test data
- [Ajv](https://ajv.js.org/) – schema validation
- [dotenv](https://www.npmjs.com/package/dotenv) – environment configuration
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

### 4. Create a `.env` file (or `.env.local`)

```env
API_URL=http://localhost:3001/api/v1/
FRONTEND_URL=http://localhost:3000/
```

> ⚠️ **Important**: Make sure your URLs end with a `/`.

---

## 🧪 Running the Tests

### Run all tests

```bash
npm test
```

### Run only API tests

```bash
npx playwright test --project=api
```

### Run only UI tests

```bash
npx playwright test --project=ui
```

### Run a specific test file

```bash
npx playwright test tests/api/auth/sign-in.api.spec.ts --project=api
npx playwright test tests/ui/auth/sign-in.ui.spec.ts --project=ui
```

### View the HTML report

```bash
npm run report
# Then open: playwright-report/index.html
```

---

## 🧠 Folder Structure

```
.
├── api/
│   ├── controllers/          # API controllers
│   ├── helpers/              # Data generators, schema validator, etc.
│   └── schemas/              # OpenAPI schemas
│
├── tests/
│   ├── api/                  # API tests
│   │   └── authentication/
│   │   └── helpers/
│   └── ui/                   # UI tests
│       └── auth/
│
├── ui/
│   ├── controllers/          # UI Page Objects
│   └── utils/                # UI helpers (coming soon)
│
├── .env                      # Environment variables
├── playwright.config.ts      # Playwright test config
├── tsconfig.json
└── package.json
```

---

## ✨ Features

- ✅ Fully separated UI and API test projects
- ✅ Type-safe test data using Faker
- ✅ Schema validation with Ajv
- ✅ Page Object Model for UI interactions
- ✅ Custom helper methods for repeated logic
- ✅ Multi-environment setup via `.env` files

---

## ✅ TODO

- [x] Add API test cases (auth, users)
- [x] Setup schema validation
- [x] Add shared helper methods
- [x] UI test page object abstraction
- [x] Finalize CI configuration with production deployment

---

## 👤 Author

Victor Vagabculov  
Binary Studio Academy 2025  
[GitHub Profile](https://github.com/VictorVagabculov)
