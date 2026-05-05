const { expect } = require("chai");
const { api } = require("../utils/apiClient");
const { generateUser } = require("../utils/user");
const { registerAndGetToken } = require("../utils/auth");
const { validateSchema, schemas } = require("../utils/schemaValidator");
require("dotenv").config();

// Get All Users
describe("User Profile - Get All Users", function () {
  it("[POS] should retrieve all users with a valid access token", async function () {
    const user = generateUser();
    const {token} = await registerAndGetToken(user);

    const res = await api()
      .get("/users")
      .set("Authorization", `Bearer ${token}`)
      .expect(200);

    // Schema validation
    validateSchema(res.body, schemas.usersListSuccess);

    // Field presence & data types
    expect(res.body.status).to.equal("success");
    expect(res.body.data).to.be.an("array");
    expect(res.body.status).to.be.a("string");
  });

  it("[NEG] should not retrieve all users with an invalid access token", async function () {
    const invalidToken = process.env.INVALID_TOKEN;

    const res = await api()
      .get("/users")
      .set("Authorization", `Bearer ${invalidToken}`)
      .expect(401);

    validateSchema(res.body, schemas.errorResponse);
    expect(res.body.status).to.equal("error");
    expect(res.body.message).to.equal("Token is invalid!");
  });

  it("[NEG] should not retrieve all users without any access token", async function () {
    const res = await api()
      .get("/users")
      .expect(401);

    validateSchema(res.body, schemas.errorResponse);
    expect(res.body.status).to.equal("error");
    expect(res.body.error).to.equal("Unauthorized");
    expect(res.body.message).to.equal("Token could not be found!");
  });

  it("[NEG] should not retrieve all users with a malformed Bearer header", async function () {
    const user = generateUser();
    const {token} = await registerAndGetToken(user);

    const res = await api()
      .get("/users")
      .set("Authorization", token)
      .expect(401);


    validateSchema(res.body, schemas.errorResponse);
    expect(res.body.status).to.equal("error");
  });

  it("[EDGE] should not retrieve all users with an empty Bearer token", async function () {
    const res = await api()
      .get("/users")
      .set("Authorization", "Bearer ")
      .expect(401);

    validateSchema(res.body, schemas.errorResponse);
    expect(res.body.status).to.equal("error");
  });
});

// Get User By ID 
describe("User Profile - Get User By ID", function () {
  it("[POS] should retrieve a user with a valid token and valid userId", async function () {

    const newUser = generateUser();
    const email = newUser.email;
    const { token, userId } = await registerAndGetToken(newUser);

    const res = await api()
      .get(`/users/${userId}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(200);

    // Schema validation
    validateSchema(res.body.data, schemas.userObject);

    // Field presence & data types
    expect(res.body.status).to.equal("success");
    expect(res.body.data).to.be.an("object");
    expect(res.body.data.id).to.be.a("string");
    expect(res.body.data.email).to.be.a("string");

    // Field values
    expect(res.body.data.id).to.equal(userId);
    expect(res.body.data.email).to.equal(email);
  });

  it("[NEG] should fail to retrieve user without an access token", async function () {
    const user = generateUser();
    const userId = await registerAndGetToken(user);

    const res = await api()
      .get(`/users/${userId}`)
      .expect(401);

    validateSchema(res.body, schemas.errorResponse);
    expect(res.body.status).to.equal("error");
    expect(res.body.error).to.include("Unauthorized");
    expect(res.body.message).to.include("Token could not be found!");
  });

  it("[NEG] should fail to retrieve user with an invalid access token", async function () {
    const user = generateUser();
    const userId = (await registerAndGetToken(user)).userId;
    
    const invalidToken = process.env.INVALID_TOKEN;

    const res = await api()
      .get(`/users/${userId}`)
      .set("Authorization", `Bearer ${invalidToken}`)
      .expect(401);

    validateSchema(res.body, schemas.errorResponse);
    expect(res.body.status).to.equal("error");
    expect(res.body.message).to.include("Token is invalid!");
  });

  it("[NEG] should fail to retrieve user with a non-existent userId", async function () {
    const user = generateUser();
    const token = (await registerAndGetToken(user)).token;
    const fakeId = process.env.FAKE_USER_ID;

    const res = await api()
      .get(`/users/${fakeId}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(400);

    validateSchema(res.body, schemas.errorResponse);
    expect(res.body.status).to.equal("error");
  });

  it("[EDGE] should fail to retrieve user with a numeric userId", async function () {
    const newUser = generateUser();
    const { token } = await registerAndGetToken(newUser);

    const res = await api()
      .get(`/users/12345`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).to.be.oneOf([400, 404, 422]);
    validateSchema(res.body, schemas.errorResponse);
    expect(res.body.status).to.equal("error");
  });

  it("[EDGE] should fail to retrieve user with special characters in userId", async function () {
    const newUser = generateUser();
    const { token } = await registerAndGetToken(newUser);
    const specialCharId = process.env.SPECIAL_CHAR_USER_ID;

    const res = await api()
      .get(`/users/${specialCharId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).to.equal(400);
  });
});
