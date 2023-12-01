import chai from "chai";
import chaiHttp from "chai-http";
import { app } from "../src/index";

chai.use(chaiHttp);
describe("testing routes", function () {
    const request = chai.request(app);

    after((done) => {
        request.close(), done();
    });

    it("test route", async function () {
        return chai
            .request(app)
            .get("/")
            .then((res) => {
                chai.expect(res.status).to.eql(200);
            });
    });
});
