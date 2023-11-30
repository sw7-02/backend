import supertest from "supertest";
import assert from "assert";

const app = require("../src/index");

describe("testing routes", function () {
    it("test route", async function (done) {
        this.timeout(10000);
        let res = supertest(app)
            .get("/")
            .then((res) => {
                console.log(`right before assert status, ${res.status}`);
                assert.equal(res.status, 200);
                console.log(`right after`);
            })
            .finally(done);
    });
});
