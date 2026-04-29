const Ajv = require("ajv");
const { expect } = require("chai");

const ajv = new Ajv({ allErrors: true });

/**
 * @param {object} data - The response body to validate
 * @param {object} schema - The AJV-compatible JSON schema
 */

function validateSchema(data, schema) {
  const validate = ajv.compile(schema);
  const valid = validate(data);
  expect(valid, `Schema validation failed: ${JSON.stringify(validate.errors, null, 2)}`).to.be.true;
}

// Reusable schemas

const schemas = {
  authSuccess: {
    type: "object",
    required: ["status", "data"],
    properties: {
      status: { type: "string", enum: ["success"] },
      data: {
        type: "object",
        required: ["access_token", "user"],
        properties: {
          access_token: { type: "string" },
          user: {
            type: "object",
            required: ["id", "email", "username"],
            properties: {
              id: { type: "string" },
              email: { type: "string" },
              username: { type: "string" }
            }
          }
        }
      }
    },
    additionalProperties: true
  },

  errorResponse: {
    type: "object",
    required: ["status", "message"],
    properties: {
      status: { type: "string", enum: ["error"] },
      message: { type: "string" }
    },
    additionalProperties: true
  },

  userObject: {
    type: "object",
    required: ["id", "email", "username"],
    properties: {
      id: { type: "string" },
      email: { type: "string" },
      username: { type: "string" },
      first_name: { type: "string" },
      last_name: { type: "string" }
    },
    additionalProperties: true
  },

  usersListSuccess: {
    type: "object",
    required: ["status", "data"],
    properties: {
      status: { type: "string", enum: ["success"] },
      data: { type: "array" }
    },
    additionalProperties: true
  }
};

module.exports = { validateSchema, schemas };
