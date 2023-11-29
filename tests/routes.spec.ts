const supertest = require("supertest");
const assert = require("assert");
const app = require("../src/index");

describe("testing routes", function () {
    it("test route", async function (done) {
        try {
            const res = await supertest(app).get("/").end(); //.expect(200).end(done());
            assert.equal(res.status, 200);
        } catch (e) {
            console.log(`THis is shit for this reason: ${e}`);
        }
        /*.then((response: { body: unknown }) => {
                assert.equal(response.body, "u made a GET request");
            });*/
    });
});
