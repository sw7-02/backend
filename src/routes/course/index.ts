import Router, {Request, Response} from "express"
import course_overview from "./course_overview";

const routes = Router();

// enables passing json bodies.
routes.use(Router.json());

routes.use("/", course_overview);

export default routes;