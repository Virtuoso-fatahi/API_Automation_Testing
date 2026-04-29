const { expect } = require("chai");
const { api } = require("../utils/apiClient");
const { generateUser } = require("../utils/user");
require("dotenv").config();

describe("User Profile", function () {
    describe("Get All User", function () {
        it("[POS] should retrieve all users with valid access token", async function () {


            // Retrieve all users with token
            const res = await api()
                .get("/users")
                .set("Authorization", `Bearer ${process.env.ACCESS_TOKEN}`)
                .expect(200);


            // Validate response
            expect(res.body.status).to.equal("success");
            expect(res.body.data).to.be.an("array");
        });

        it("[NEG] should not retrieve all users with invalid access token", async function () {
            const newUser = generateUser();

            // Register user
            await api()
                .post("/auth/register")
                .send(newUser)

            // Login to get access token
            const loginRes = await api()
                .post("/auth/login")
                .send({
                    email: newUser.email,
                    password: newUser.password
                })


            const token = loginRes.body.data.access_token;
            const invalidToken = token.slice(0, -5) + token.slice(-5).split("").reverse().join("");


            // Retrieve all users with token
            const res = await api()
                .get("/users")
                .set("Authorization", `Bearer ${invalidToken}`)
                .expect(401);



            // Validate response
            expect(res.body.status).to.equal("error");
            expect(res.body.message).to.be.equal("Token is invalid!");
        });

        it("[NEG] should not retrieve all users without valid access token", async function () {
            // Retrieve all users without token
            const res = await api()
                .get("/users")
                .expect(401);



            // Validate response
            expect(res.body.status).to.equal("error");
            expect(res.body.error).to.equal("Unauthorized");
            expect(res.body.message).to.equal("Token could not be found!");
        });
    });

    describe("Get User By ID", () => {
        it("[POS] should retrieve a user with valid token and valid userId", async function () {
            const newUser = generateUser();

            // Register user
            const registerRes = await api()
                .post("/auth/register")
                .send(newUser)


            const userId = registerRes.body.data.user.id;


            // Login to get token
            const loginRes = await api()
                .post("/auth/login")
                .send({
                    email: newUser.email,
                    password: newUser.password
                })

            const token = loginRes.body.data.access_token;


            // Retrieve user by ID
            const res = await api()
                .get(`/users/${userId}`)
                .set("Authorization", `Bearer ${token}`)
                .expect(200);




            // Validate response
            expect(res.body.status).to.equal("success");
            expect(res.body.data).to.be.an("object");
            expect(res.body.data).to.have.property("id", userId);
            expect(res.body.data).to.have.property("email", newUser.email);
        });

        it("[NEG] should fail to retrieve user without access token", async function () {
            const newUser = generateUser();

            // Register user
            const registerRes = await api()
                .post("/auth/register")
                .send(newUser)


            const userId = registerRes.body.data.user.id;

            // Attempt to retrieve user without token
            const res = await api()
                .get(`/users/${userId}`)
                .expect(401);




            // Validate error response
            expect(res.body.status).to.equal("error");
            expect(res.body.error).to.include("Unauthorized");
            expect(res.body.message).to.include("Token could not be found!");
        });

        it("[NEG] should fail to retrieve user with invalid access token", async function () {
            const newUser = generateUser();

            // Register user
            const registerRes = await api()
                .post("/auth/register")
                .send(newUser)


            const token = registerRes.body.data.access_token;
            const invalidToken = token.slice(0, -5) + token.slice(-5).split("").reverse().join("");
            const userId = registerRes.body.data.user.id;

            // Attempt to retrieve user with invalid token
            const res = await api()
                .get(`/users/${userId}`)
                .set("Authorization", `Bearer ${invalidToken}`)
                .expect(401);






            // Validate error response
            expect(res.body.status).to.equal("error");
            expect(res.body.error).to.include("Unauthorized");
            expect(res.body.message).to.include("Token is invalid!");
        });
    });

});
