import chai from "chai";
import chaiHttp from "chai-http";
import { app } from "../src/index";
import * as assert from "assert";

chai.use(chaiHttp);
describe("testing routes", function () {
    //const request = chai.request(app);

    it("test route", (done) => {
        return chai
            .request(app)
            .get("/")
            .then((res) => {
                assert.equal(res.status, 200);
                assert.equal(res.text, "U made a GET request");
            });
    });
});
