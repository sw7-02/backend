import * as chai from "chai";
import chaiHttp from "chai-http"
import assert from "assert";
import {app} from "../src/index"

chai.use(chaiHttp);
describe("testing routes", function () {
    it("test route", async function (done) {
        return chai.request(app).get('/').then(res => {
            chai.expect(res.status).to.eql(200);
        })
    });
});
