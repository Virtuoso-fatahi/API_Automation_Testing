# Zedu API Automation Testing

![CI](https://github.com/Virtuoso-fatahi/API_Automation_Testing/actions/workflows/api_automation_ci.yml/badge.svg)

## Project Overview

This project is a structured API automation test suite built for the Zedu platform. It demonstrates API automation skills, clean test architecture, proper authentication handling, and real-world QA engineering practices.

The suite is designed so that any engineer can clone, set up, and run all tests successfully without additional guidance.

---

## System Under Test

- **Production URL:** https://zedu.chat/
- **API Documentation (Swagger):** https://api.zedu.chat/swagger/#/auth

---

## Tech Stack

| Tool | Purpose |
|---|---|
| Mocha | Test framework |
| Chai | Assertion library |
| Supertest | HTTP client |
| dotenv | Environment variable management |
| @faker-js/faker | Dynamic test data generation |
| Ajv | JSON schema validation |

---

## Project Structure

```
zedu-api-auto/
│
├── .github/
│   └── workflows/
│       └── api_automation_ci.yml                # GitHub Actions CI configuration
│
├── tests/
│   ├── auth.test.js              # Registration and login tests
│   └── users.test.js             # User profile and protected route tests
│
├── utils/
│   ├── apiClient.js              # Supertest base client
│   ├── auth.js                   # Shared login/token utility
│   ├── config.js                 # Environment variable loader
│   ├── schemaValidator.js        # AJV schema validation helper
│   └── user.js                   # Faker-based user data generator
│
├── reports/                      # Auto-generated Mochawesome HTML reports
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

---

## Prerequisites

- **Node.js** v16 or higher
- **npm** (bundled with Node.js)

Verify your versions:

```bash
node --version
npm --version
```

---

## Setup Instructions

### 1. Clone the repository

```bash
git clone <repo-link>
cd <repo-name>
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the root of the project by copying the example:

```bash
cp .env.example .env
```

Then fill in the required values in `.env`:

```env
# Base URL of the API under test
BASE_URL=https://api.zedu.chat/api/v1

# Password used when generating test users (must meet API complexity rules)
GEN_PASSWORD=ValidPass321!

# Used for negative/edge login tests
WRONG_EMAIL=nonexistent@fake.com
WRONG_PASSWORD=WrongPassword444!

# Static invalid inputs for validation tests
INVALID_EMAIL=invalidemail
NUMERIC_EMAIL=12345678
EMAIL_INJECTION=' OR '3'='3
EMAIL_DOMAIN=@example.com

# Used for auth header tests
INVALID_TOKEN=invalidtoken123456

# Used for user-by-ID negative tests
FAKE_USER_ID=00000000-2222-0000-1111-000000000000
SPECIAL_CHAR_USER_ID=!@#$%^

# Request timeout in milliseconds
TIMEOUT=10000
```

> ⚠️ Never commit your `.env` file to GitHub. Only `.env.example` (with no real secrets) should be committed.

---

## Environment Variables

The following environment variables are required for the test suite to run. These must be defined in a `.env` file locally, or configured as **GitHub Actions Secrets** in CI.

| Variable | Description |
|---|---|
| `BASE_URL` | Base URL for the Zedu API |
| `EMAIL` | Registered test account email |
| `PASSWORD` | Registered test account password |
| `WRONG_EMAIL` | Non-existent email for negative tests |
| `WRONG_PASSWORD` | Incorrect password for negative tests |
| `INVALID_EMAIL` | Malformed email for validation tests |
| `GEN_PASSWORD` | Password used for dynamically generated users |
| `TIMEOUT` | Request timeout in milliseconds |

> ⚠️ Never commit your `.env` file. All sensitive values in CI are stored as encrypted GitHub Secrets.

---

## Running Tests

Run the full test suite:

```bash
npm test
```

Run with an HTML report (saved to `/reports`):

```bash
npm run test:report
```

---

## CI/CD Pipeline

This project uses **GitHub Actions** for continuous integration.

The pipeline is defined in `.github/workflows/ci.yml` and does the following automatically on every push and pull request to `main`:

1. Spins up a clean Ubuntu environment
2. Installs Node.js v20
3. Installs all dependencies via `npm ci`
4. Runs the full test suite via `npm test`
5. Uploads the Mochawesome HTML report as a downloadable artifact

The pipeline is configured to **fail if any test fails**. There is no silent skipping of tests.

To view a pipeline run, go to the **Actions** tab in this repository.

---

## Test File Breakdown

### `test/auth.test.js`

Covers the `/auth/register` and `/auth/login` endpoints.

- Successful user registration with response schema and data type validation
- Registration failures: missing email, missing password, invalid email format, duplicate phone number, empty body, numeric email type, whitespace-only fields, extremely long email
- Successful login with valid credentials
- Login failures: unregistered email, wrong password, empty email, empty password, both fields empty, invalid email format
- Edge cases: uppercase email variation, SQL injection string in email field

### `test/users.test.js`

Covers the `/users` and `/users/:id` endpoints.

- Retrieving all users with a valid token
- Failures: invalid token, no token, malformed Authorization header, empty Bearer token
- Retrieving a single user by ID with valid credentials
- Failures: no token, invalid token, non-existent user ID
- Edge cases: numeric user ID, special characters in user ID

---

## Key Implementation Notes

**Authentication** — Tokens are fetched programmatically via `utils/auth.js`. No hardcoded tokens exist anywhere in the codebase.

**Test independence** — Every test creates its own user via `generateUser()` inside the test body. No shared state between tests.

**Idempotency** — Dynamic data (unique emails, usernames, phone numbers) via Faker ensures tests pass on repeated runs without data conflicts.

**Schema validation** — Every positive test validates the full response shape using Ajv via `utils/schemaValidator.js`.

**Data type assertions** — Every test asserts field types (string, object, array) in addition to values.

---

## Author

Abdulfatahi Showunmi — QA Engineer
