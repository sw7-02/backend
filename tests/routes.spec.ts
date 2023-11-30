const supertest = require("supertest");
const assert = require("assert");
const app = require("../src/index");

describe("testing routes", function () {
    it("test route", async function (done) {
        const res = await supertest(app)
            .get("/")
            .end((err: Error, res: any) => {
                if (err) done(err);
                done();
            }); //.expect(200).end(done());
        //assert.equal(res.status, 200);
        /*.then((response: { body: unknown }) => {
                assert.equal(response.body, "u made a GET request");
            });*/
    });
});
