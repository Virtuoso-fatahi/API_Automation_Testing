require("dotenv").config();

function required(key) {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required env variable: ${key}`);
  }
  return value;
}

const config = {
  BASE_URL: required("BASE_URL"),
  TIMEOUT: process.env.TIMEOUT || 10000
};

module.exports = config;