// utils/dataGenerator.js
const { faker } = require("@faker-js/faker");
const { configDotenv } = require("dotenv");
configDotenv();

function generateUser() {
  return {
    username: faker.internet.username(),
    email: faker.internet.email().toLowerCase(),
    password: process.env.GEN_PASSWORD,
    first_name: faker.person.firstName(),
    last_name: faker.person.lastName(),
    phone_number: faker.phone.number("080########")
  };
}

module.exports = { generateUser };