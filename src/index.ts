import express from "express";
import * as bodyParser from "body-parser";
import helmet from "helmet";
import cors from "cors";
import routes from "./routes";


const app = express();

// Call middlewares
app.use(cors());
app.use(helmet());
app.use(bodyParser.json());

//Set all routes from routes folder
app.use("/", routes);
/*app.use("/", (req, res) => {
    res.status(201).send("Hello World!");
})*/

app.listen(3000, () => {
    console.log("Server started on port 3000!");
});
