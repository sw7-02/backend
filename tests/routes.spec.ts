import chai from "chai";
import chaiHttp from "chai-http";
import { app } from "../src/index";

chai.use(chaiHttp);
describe("testing routes", function () {
    //const request = chai.request(app);

    it("test route", (done) => {
        done()
        /*return chai
            .request(app)
            .get("/")
            .end((err, res) => {
                chai.expect(res.status).to.eql(200);
                request.close();
                return done();
        });*/
    });
});
