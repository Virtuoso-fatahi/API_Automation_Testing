const { api } = require("./apiClient");

/**
 * @param {string} email
 * @param {string} password
 * @returns {Promise<string>} access_token
 */
async function getToken(email, password) {
  const res = await api()
    .post("/auth/login")
    .send({ email, password });

  if (!res.body.data || !res.body.data.access_token) {
    throw new Error(
      `Login failed for ${email}: ${res.body.message || "no token returned"}`
    );
  }

  return res.body.data.access_token;
}

/**
 * @param {object} userPayload
 * @returns {Promise<{ token: string, userId: string }>}
 */
async function registerAndGetToken(userPayload) {
  const res = await api()
    .post("/auth/register")
    .send(userPayload);

  if (!res.body.data || !res.body.data.access_token) {
    throw new Error(
      `Registration failed for ${userPayload.email}: ${res.body.message || "no token returned"}`
    );
  }

  return {
    token: res.body.data.access_token,
    userId: res.body.data.user.id
  };
}

module.exports = { getToken, registerAndGetToken };
