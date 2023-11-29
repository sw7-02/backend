const supertest = require("supertest");
const assert = require("assert");
const app = require("../src/index");

describe("testing routes", function () {
    it("test route", function (done) {
        return supertest(app).get("/").expect(200,done);
        /*.then((response: { body: unknown }) => {
                assert.equal(response.body, "u made a GET request");
            });*/
    });
});
