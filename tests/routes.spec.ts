import express from "express";
import httpMocks from "node-mocks-http";
import * as assert from "assert";

const request = require("supertest");
const app = express();

describe("testing routes", function () {
    it("test route", function () {
        return request(app)
            .get("/status")
            .expect(200)
            .then((response: { body: unknown }) => {
                assert.equal(response.body, "Service is running!");
            });
    });
});
