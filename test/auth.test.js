const { expect } = require("chai");
const { api } = require("../utils/apiClient");
const { generateUser } = require("../utils/user");
require("dotenv").config();

const payload = generateUser();
describe("User Registration", function () {
    it("[POS] should register a new user successfully", async function () {
        const res = await api()
            .post("/auth/register")
            .send(payload)
            .expect(201);

        // Validate response structure
        expect(res.body.data.access_token).to.exist;
        expect(res.body.data.user).to.have.property("username", payload.username);
        expect(res.body.data.user).to.have.property("email", payload.email);
    });

    it("[NEG] should fail to register user with missing email", async function () {
        const invalidPayload = { ...payload };
        delete invalidPayload.email;

        const res = await api()
            .post("/auth/register")
            .send(invalidPayload)
            .expect(422);


        // Validate error response
        expect(res.body.status).to.equal('error');
        expect(res.body.message).to.equal('Validation failed');
        expect(res.body.error).to.have.property('CreateUserRequestModel.email');
    });

    it("[NEG] should fail to register user with invalid email format", async function () {
        const invalidPayload = { ...payload };
        invalidPayload.email = process.env.INVALID_EMAIL;

        const res = await api()
            .post("/auth/register")
            .send(invalidPayload)
            .expect(400);



        // Validate error response
        expect(res.body.status).to.equal('error');
        expect(res.body.message).to.equal('email address is invalid');
        expect(res.body.error).to.be.empty;
    });

    it("[NEG] should fail to register user with missing password", async function () {
        const invalidPayload = { ...payload };
        delete invalidPayload.password;

        const res = await api()
            .post("/auth/register")
            .send(invalidPayload)
            .expect(422);

        // Validate error response
        expect(res.body.status).to.equal('error');
        expect(res.body.message).to.equal('Validation failed');
        expect(res.body.error).to.have.property('CreateUserRequestModel.password');
    });

    it("[NEG] should fail to register user with existing phone number", async function () {
        // Generate a new user for the first registration
        const newUser = generateUser();

        // First, create a user
        await api()
            .post("/auth/register")
            .send(newUser)

        // Try to register again with the same phone number
        const res = await api()
            .post("/auth/register")
            .send(newUser)
            .expect(400);

        // Validate error response
        expect(res.body.status).to.equal('error');
        expect(res.body.status_code).to.equal(400);
        expect(res.body.message).to.equal('user already exists with the given phone');
        expect(res.body.error).to.be.empty;
    });


    it("[NEG] should fail to register user with empty request body", async function () {
        const res = await api()
            .post("/auth/register")
            .send({})
            .expect(422);

        // Validate error response
        expect(res.body.status).to.equal('error');
        expect(res.body.message).to.equal('Validation failed');
        expect(res.body.error).to.have.property('CreateUserRequestModel.email');
        expect(res.body.error).to.have.property('CreateUserRequestModel.password');
    });

    it("[EGDE] should fail to register user with whitespace only in fields", async function () {
        const invalidPayload = {
            username: "   ",
            email: "   ",
            password: "   ",
            first_name: "   ",
            last_name: "   ",
            phone_number: "   "
        };

        const res = await api()
            .post("/auth/register")
            .send(invalidPayload)
            .expect(400);

        // Validate error response
        expect(res.body.status).to.equal('error');
        expect(res.body.message).to.equal('email address is invalid');
    });

});

// Login tests
describe("User Login", function () {
    it("[POS] should login with valid email and password", async function () {

        // Now login with the created user
        const res = await api()
            .post("/auth/login")
            .send({
                email: process.env.EMAIL,
                password: process.env.PASSWORD
            })
            .expect(200);

        
            

        // Validate response structure
        expect(res.body.status).to.equal('success');
        expect(res.body.data).to.have.property("access_token");
        expect(res.body.data).to.have.property("user");
        expect(res.body.data.user).to.have.property("email", process.env.EMAIL);
    });

    it("[NEG] should fail to login with unregistered email", async function () {
        
        const res = await api()
            .post("/auth/login")
            .send({
                email: process.env.WRONG_EMAIL,
                password: process.env.PASSWORD
            })
            .expect(400);
            

        // Validate error response
        expect(res.body.status).to.equal('error');
        expect(res.body.message).to.include('invalid');
    });

    it("[NEG] should fail to login with incorrect password", async function () {
        const res = await api()
            .post("/auth/login")
            .send({
                email: process.env.EMAIL,
                password: process.env.WRONG_PASSWORD
            })
            .expect(400);

        // Validate error response
        expect(res.body.status).to.equal('error');
        expect(res.body.message).to.include('invalid');
    });

    it("[NEG] should fail to login with empty email", async function () {

        const res = await api()
            .post("/auth/login")
            .send({
                email: "",
                password: process.env.PASSWORD
            })
            .expect(400);

        // Validate error response
        expect(res.body.status).to.equal('error');
        expect(res.body.message).to.include('Validation failed');
        expect(res.body.error).to.have.property('LoginRequestModel.email');
    });

    it("[NEG] should fail to login with empty password", async function () {

        const res = await api()
            .post("/auth/login")
            .send({
                email: process.env.EMAIL,
                password: ""
            })
            .expect(400);


        // Validate error response
        expect(res.body.status).to.equal('error');
        expect(res.body.message).to.include('Validation failed');
        expect(res.body.error).to.have.property('LoginRequestModel.password');
    });

    it("[NEG] should fail to login with both fields empty", async function () {
        const res = await api()
            .post("/auth/login")
            .send({
                email: "",
                password: ""
            })
            .expect(400);

        // Validate error response
        expect(res.body.status).to.equal('error');
        expect(res.body.message).to.include('Validation failed');
        expect(res.body.error).to.have.property('LoginRequestModel.email');
        expect(res.body.error).to.have.property('LoginRequestModel.password');
    });

    it("[NEG] should fail to login with invalid email format", async function () {

        const res = await api()
            .post("/auth/login")
            .send({
                email: process.env.INVALID_EMAIL,
                password: process.env.PASSWORD
            })
            .expect(400);


        // Validate error response
        expect(res.body.status).to.equal('error');
        expect(res.body.message).to.include('invalid credentials');
        expect(res.body.error).to.be.empty;
    });

    it("[EDGE] case sensitive email variation", async function () {

        // Convert email to different case (upper/lower mix)
        const caseEmail = process.env.EMAIL.toUpperCase();

        const res = await api()
            .post("/auth/login")
            .send({
                email: caseEmail,
                password: process.env.PASSWORD
            })
            .expect(400);



        // Validate success response
        expect(res.body.status).to.equal('error');
        expect(res.body.message).to.include('invalid credentials');
        expect(res.body.error).to.be.empty;
    });
});

