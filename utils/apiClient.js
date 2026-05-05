const request = require("supertest");
const { BASE_URL } = require("./config");

function api() {
  return request(BASE_URL);
}

module.exports = {
  api
};