const request = require("supertest");
const { BASE_URL } = require("./config");

function api() {
  return request(BASE_URL);
}

// Helper for authenticated requests
function withAuth(req, token) {
  return req.set("Authorization", `Bearer ${token}`);
}

module.exports = {
  api,
  withAuth
};