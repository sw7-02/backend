import chai from "chai";
import chaiHttp from "chai-http";
import { app } from "../src/index";
import http from "http";

chai.use(chaiHttp);
describe("testing routes", function () {
    const server = http.createServer(app);
    const request = chai.request(server);

    after(done => server.close(done));

    it("test route", async function () {
        return chai
            .request(app)
            .get("/")
            .then((res) => {
                chai.expect(res.status).to.eql(200);
            });
    });
});
