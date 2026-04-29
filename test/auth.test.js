const { expect } = require("chai");
const { api } = require("../utils/apiClient");
const { generateUser } = require("../utils/user");
const { validateSchema, schemas } = require("../utils/schemaValidator");
require("dotenv").config();

// Registration Tests
describe("User Registration", function () {
  it("[POS] should register a new user successfully", async function () {
    const payload = generateUser();
    
    const res = await api()
      .post("/auth/register")
      .send(payload)
      .expect(201);

    // Schema validation
    validateSchema(res.body, schemas.authSuccess);

    // Field presence
    expect(res.body.data).to.have.property("access_token");
    expect(res.body.data).to.have.property("user");

    // Data types
    expect(res.body.data.access_token).to.be.a("string");
    expect(res.body.data.user).to.be.an("object");
    expect(res.body.data.user.id).to.be.a("string");

    // Field values
    expect(res.body.data.user.username).to.equal(payload.username);
    expect(res.body.data.user.email).to.equal(payload.email);
  });

  it("[NEG] should fail to register with missing email", async function () {
    const payload = generateUser();
    delete payload.email;

    const res = await api()
      .post("/auth/register")
      .send(payload)
      .expect(422);

    validateSchema(res.body, schemas.errorResponse);
    expect(res.body.status).to.equal("error");
    expect(res.body.message).to.equal("Validation failed");
    expect(res.body.error).to.have.property("CreateUserRequestModel.email");
  });

  it("[NEG] should fail to register with invalid email format", async function () {
    const payload = generateUser();
    payload.email = process.env.INVALID_EMAIL;

    const res = await api()
      .post("/auth/register")
      .send(payload)
      .expect(400);

    validateSchema(res.body, schemas.errorResponse);
    expect(res.body.status).to.equal("error");
    expect(res.body.message).to.equal("email address is invalid");
  });

  it("[NEG] should fail to register with missing password", async function () {
    const payload = generateUser();
    delete payload.password;

    const res = await api()
      .post("/auth/register")
      .send(payload)
      .expect(422);

    validateSchema(res.body, schemas.errorResponse);
    expect(res.body.status).to.equal("error");
    expect(res.body.message).to.equal("Validation failed");
    expect(res.body.error).to.have.property("CreateUserRequestModel.password");
  });

  it("[NEG] should fail to register with a duplicate phone number", async function () {
    const newUser = generateUser();

    await api().post("/auth/register").send(newUser);

    const res = await api()
      .post("/auth/register")
      .send(newUser)
      .expect(400);

    validateSchema(res.body, schemas.errorResponse);
    expect(res.body.status).to.equal("error");
    expect(res.body.status_code).to.equal(400);
    expect(res.body.message).to.equal("user already exists with the given phone");
  });

  it("[NEG] should fail to register with an empty request body", async function () {
    const res = await api()
      .post("/auth/register")
      .send({})
      .expect(422);

    validateSchema(res.body, schemas.errorResponse);
    expect(res.body.status).to.equal("error");
    expect(res.body.message).to.equal("Validation failed");
    expect(res.body.error).to.have.property("CreateUserRequestModel.email");
    expect(res.body.error).to.have.property("CreateUserRequestModel.password");
  });

  it("[NEG] should fail to register with a numeric value for email", async function () {
    const payload = generateUser();
    payload.email = process.env.NUMERIC_EMAIL;

    const res = await api()
      .post("/auth/register")
      .send(payload)
      .expect(400);

    validateSchema(res.body, schemas.errorResponse);
    expect(res.body.status).to.equal("error");
  });

  it("[EDGE] should fail to register with whitespace-only fields", async function () {
    const res = await api()
      .post("/auth/register")
      .send({
        username: "   ",
        email: "   ",
        password: "   ",
        first_name: "   ",
        last_name: "   ",
        phone_number: "   "
      })
      .expect(400);

    validateSchema(res.body, schemas.errorResponse);
    expect(res.body.status).to.equal("error");
    expect(res.body.message).to.equal("email address is invalid");
  });

  it("[EDGE] should fail to register with an extremely long email string", async function () {
    const payload = generateUser();
    payload.email = "a".repeat(300) + process.env.EMAIL_DOMAIN;

    const res = await api()
      .post("/auth/register")
      .send(payload);

    expect(res.status).to.be.oneOf([400, 422]);
    validateSchema(res.body, schemas.errorResponse);
    expect(res.body.status).to.equal("error");
  });
});

// Login Tests
describe("User Login", function () {
  it("[POS] should login with valid credentials", async function () {
    const res = await api()
      .post("/auth/login")
      .send({
        email: process.env.EMAIL,
        password: process.env.PASSWORD
      })
      .expect(200);

    // Schema validation
    validateSchema(res.body, schemas.authSuccess);

    // Field presence
    expect(res.body.data).to.have.property("access_token");
    expect(res.body.data).to.have.property("user");

    // Data types
    expect(res.body.data.access_token).to.be.a("string");
    expect(res.body.data.user).to.be.an("object");
    expect(res.body.data.user.email).to.be.a("string");

    // Field values
    expect(res.body.status).to.equal("success");
    expect(res.body.data.user.email).to.equal(process.env.EMAIL);
  });

  it("[NEG] should fail to login with an unregistered email", async function () {
    const res = await api()
      .post("/auth/login")
      .send({
        email: process.env.WRONG_EMAIL,
        password: process.env.PASSWORD
      })
      .expect(400);

    validateSchema(res.body, schemas.errorResponse);
    expect(res.body.status).to.equal("error");
    expect(res.body.message).to.include("invalid");
  });

  it("[NEG] should fail to login with incorrect password", async function () {
    const res = await api()
      .post("/auth/login")
      .send({
        email: process.env.EMAIL,
        password: process.env.WRONG_PASSWORD
      })
      .expect(400);

    validateSchema(res.body, schemas.errorResponse);
    expect(res.body.status).to.equal("error");
    expect(res.body.message).to.include("invalid");
  });

  it("[NEG] should fail to login with empty email", async function () {
    const res = await api()
      .post("/auth/login")
      .send({ email: "", password: process.env.PASSWORD })
      .expect(400);

    validateSchema(res.body, schemas.errorResponse);
    expect(res.body.status).to.equal("error");
    expect(res.body.message).to.include("Validation failed");
    expect(res.body.error).to.have.property("LoginRequestModel.email");
  });

  it("[NEG] should fail to login with empty password", async function () {
    const res = await api()
      .post("/auth/login")
      .send({ email: process.env.EMAIL, password: "" })
      .expect(400);

    validateSchema(res.body, schemas.errorResponse);
    expect(res.body.status).to.equal("error");
    expect(res.body.message).to.include("Validation failed");
    expect(res.body.error).to.have.property("LoginRequestModel.password");
  });

  it("[NEG] should fail to login with both fields empty", async function () {
    const res = await api()
      .post("/auth/login")
      .send({ email: "", password: "" })
      .expect(400);

    validateSchema(res.body, schemas.errorResponse);
    expect(res.body.status).to.equal("error");
    expect(res.body.message).to.include("Validation failed");
    expect(res.body.error).to.have.property("LoginRequestModel.email");
    expect(res.body.error).to.have.property("LoginRequestModel.password");
  });

  it("[NEG] should fail to login with invalid email format", async function () {
    const res = await api()
      .post("/auth/login")
      .send({
        email: process.env.INVALID_EMAIL,
        password: process.env.PASSWORD
      })
      .expect(400);

    validateSchema(res.body, schemas.errorResponse);
    expect(res.body.status).to.equal("error");
    expect(res.body.message).to.include("invalid credentials");
  });

  it("[EDGE] should fail to login with uppercase version of valid email", async function () {
    const caseEmail = process.env.EMAIL.toUpperCase();

    const res = await api()
      .post("/auth/login")
      .send({ email: caseEmail, password: process.env.PASSWORD })
      .expect(400);

    validateSchema(res.body, schemas.errorResponse);
    expect(res.body.status).to.equal("error");
    expect(res.body.message).to.include("invalid credentials");
  });

  it("[EDGE] should fail to login with SQL injection string in email", async function () {
    const res = await api()
      .post("/auth/login")
      .send({
        email: process.env.EMAIL_INJECTION,
        password: process.env.PASSWORD
      })
      .expect(400);

    validateSchema(res.body, schemas.errorResponse);
    expect(res.body.status).to.equal("error");
  });
});
