import chai from "chai";
import chaiHttp from "chai-http";
import { app } from "../src/index";

chai.use(chaiHttp);
describe("testing routes", function () {
    //const request = chai.request(app);

    it("test route", (done) => {
        let request = chai.request(app).keepOpen();
        request.get('/')
        console.log(`request ${request}`);
        request.close();
        console.log(`request 2 ${request}`);
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
