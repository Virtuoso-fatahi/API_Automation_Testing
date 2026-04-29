# Zedu API Automation Testing

## 📌 Project Overview

This project is a **structured API automation test suite** built for the Zedu platform.

The goal is to demonstrate:

* API automation skills using code
* Clean and maintainable test architecture
* Proper authentication handling
* Strong validation and assertions
* Real-world QA engineering practices

The test suite is designed so that **any engineer can clone, set up, and run all tests successfully without additional guidance**.

---

## 🌐 System Under Test

* **Base URL:** https://zedu.chat/
* **API Documentation (Swagger):** https://api.zedu.chat/swagger/#/auth

---

## 🛠️ Tech Stack

* **Test Framework:** Mocha
* **Assertion Library:** Chai
* **HTTP Client:** Supertest
* **Environment Management:** dotenv
* **Data Generation:** @faker-js/faker
* **Schema Validation:** Ajv

---

## 📂 Project Structure

```
zedu-api-tests/
│
├── tests/
│   ├── auth/
│   │   ├── auth.test.js
│   │   └── auth.negative.test.js
│   │
│   ├── users/
│   │   ├── users.test.js
│   │   └── users.negative.test.js
│   │
│   └── other/
│       └── edgeCases.test.js
│
├── utils/
│   ├── apiClient.js
│   ├── auth.js
│   ├── config.js
│   ├── dataGenerator.js
│   └── schemaValidator.js
│
├── schemas/
├── .env.example
├── package.json
└── README.md
```

---

## ✅ Key Features & Implementation

### 🔐 Authentication Handling

* Tokens are **generated dynamically via login API**
* Stored and reused via `utils/auth.js`
* No hardcoded tokens anywhere in the codebase

---

### 🧪 Test Coverage

* **Total Tests:** 25+
* **Negative Tests:** 10+
* **Edge Cases:** 5+

Test categories include:

* Authentication (register, login, logout)
* User endpoints (CRUD operations)
* Protected routes
* Edge cases and invalid inputs

---

### 🔁 Test Design Principles

All tests are:

* **Independent** (no dependency on execution order)
* **Idempotent** (safe to run multiple times)
* **Repeatable** (consistent results every run)

Dynamic data (via Faker) ensures no duplication issues.

---

### 📊 Assertions

Each test validates:

* Status codes
* Response structure
* Field presence
* Data types
* Field values
* Error messages
* JSON schema (where applicable)

---

### ⚠️ Negative Testing Coverage

Includes:

* Invalid login credentials
* Missing authentication token
* Expired/malformed token
* Missing required fields
* Invalid data types

---

## ⚙️ Prerequisites

Ensure you have installed:

* Node.js (v16 or higher recommended)
* npm (comes with Node.js)

---

## 🔧 Setup Instructions

### 1. Clone Repository

```bash
git clone <your-repo-link>
cd <folder name>
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory:

```
BASE_URL=https://api.zedu.chat
EMAIL=your_test_email@example.com
PASSWORD=your_password
```

⚠️ Note:

* `.env` is **not committed** for security reasons
* Use `.env.example` as a reference

---

## ▶️ Running Tests

Run all tests:

```bash
npm test
```

Run with report:

```bash
npm run test:report
```

---

## 📁 Test File Breakdown

### `auth/`

* User registration
* Login functionality
* Token handling
* Negative authentication scenarios

### `users/`

* Fetch user data
* Update user
* Delete user
* Authorization checks

### `other/`

* Edge cases
* Invalid payloads
* Boundary testing

---

## 🚨 Important Notes

* The project runs **end-to-end from a fresh clone**
* No hardcoded credentials or tokens
* All configs handled via environment variables
* Tests are stable and non-flaky

---

## ✍️ Author

Abdfatahi Showunmi - QA Engineer

---
