import { Request, Response } from "express";
import chai from "chai";
import chaiHttp from "chai-http";
import { app } from "../src/index";
import * as assert from "assert";
import httpMocks from "node-mocks-http";

chai.use(chaiHttp);
let response: Response;
let request: Request;
describe("testing routes", function () {
    //const request = chai.request(app);
    beforeEach("Reset request and response", () => {
        response = httpMocks.createResponse();
    });

    it("Simple GET request", async function () {
        return chai
            .request(app)
            .get("/")
            .then((res) => {
                assert.equal(res.status, 200);
                assert.equal(res.text, "u made a GET request");
            });
    });

    it("Simple POST request", async function () {
        return chai
            .request(app)
            .post("/")
            .then((res) => {
                assert.equal(res.status, 200);
                assert.equal(res.text, "u made a POST request");
            });
    });

    it("Simple PUT request", async function () {
        return chai
            .request(app)
            .put("/")
            .then((res) => {
                assert.equal(res.status, 200);
                assert.equal(res.text, "u made a PUT request");
            });
    });

    it("Simple DELETE request", async function () {
        return chai
            .request(app)
            .delete("/")
            .then((res) => {
                assert.equal(res.status, 200);
                assert.equal(res.text, "u made a DELETE request");
            });
    });

    it("login", async function () {
        let user = { username: "user1", password: "password1@" };
        return chai
            .request(app)
            .post("/login").send(user)
            .then((res) => {
                assert.equal(res.status, 200);
                //assert.equal(res.text, "u made a DELETE request");
            });
    });
});
