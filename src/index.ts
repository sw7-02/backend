import express, { Request, Response } from "express";
import * as bodyParser from "body-parser";
import helmet from "helmet";
import cors from "cors";
import routes from "./routes";
import config from "./config";
import { seed } from "../tests/lib/db";

const app = express();

// Call middlewares
app.use(cors());
app.use(helmet());
app.disable("x-powered-by");
app.use(bodyParser.json());

//Set all routes from routes folder
app.use("/", routes);

if (process.env["NODE_ENV"] === "dev")
    seed();

app.listen(config.server.port, () => {
    console.log(`Server started on port ${config.server.port}!`);
});
