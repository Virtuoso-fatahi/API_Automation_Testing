# Zedu API Automation Testing

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
├── tests/
│   ├── auth.test.js          # Registration and login tests
│   └── users.test.js         # User profile and protected route tests
│
├── utils/
│   ├── apiClient.js              # Supertest base client
│   ├── auth.js                   # Shared login/token utility
│   ├── config.js                 # Environment variable loader
│   ├── schemaValidator.js        # AJV schema validation helper
│   └── user.js                   # Faker-based user data generator
│
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

Then fill in all values in `.env`:

```
BASE_URL=https://api.zedu.chat/api/v1
EMAIL=your_registered_email@example.com
PASSWORD=your_password
WRONG_EMAIL=nonexistent@fake.com
WRONG_PASSWORD=WrongPassword999!
INVALID_EMAIL=not-an-email
GEN_PASSWORD=ValidPass123!
TIMEOUT=10000
```

> ⚠️ The `.env` file is **not committed to GitHub**.

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
