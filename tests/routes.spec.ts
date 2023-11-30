import supertest from "supertest"
import assert from "assert"


const app = require("../src/index");

describe("testing routes", function () {
    it("test route", async function (done) {
        this.timeout(10000);
        let res = await supertest(app).get("/");
        /*.end(function (err: any, res: Response) {
                if (err instanceof Error) done(err);
            }); //.expect(200).end(done());
        //assert.equal(res.status, 200);
        /*.then((response: { body: unknown }) => {
                assert.equal(response.body, "u made a GET request");
            });*/
        /*if (res instanceof Error) {
            console.log(`res == Error: ${res}`);
            return done(res);
        }*/
        console.log(`right before assert status, ${res.status}`);
        assert.equal(res.status, 200);
        console.log(`right after`);
        done();
    });
});
