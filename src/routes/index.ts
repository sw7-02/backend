import Router, {Request, Response} from "express"
import prisma from "../prisma";
import course_overview from "./course_overview";


const routes = Router();

// enables passing json bodies.
routes.use(Router.json());


routes.use("/courses", course_overview);



// CRUD for Courses
routes.route("/")
    .get(async (req: Request, res: Response) => {
        try{
            const courses = await prisma.course.findMany()
            res.json(courses)
        }catch (e) {
            console.log(e.message)
            res.status(500).json({
                message: "Something went wrong",
            })
        }

        return res.send("u made a GET request");
    })
    .post((req: Request, res: Response) => {
        return res.send("u made a POST request");
    })
    .put((req: Request, res: Response) => {
        return res.send("u made a PUT request");
    })
    .delete((req: Request, res: Response) => {
        return res.send("u made a DELETE request");
    })




// Get

routes.get("/hey", (req: Request, res: Response) => {
    return res.redirect("http://example.com");
});

// Put (Update)


// Post
routes.post("/api/data", (req: Request, res: Response) => {
    console.log(req.body);
    //res.redirect();
    return res.sendStatus(200);
});

/*
routes.post("/courses", async (req, res) => {
    try {
      const { name, games } = req.body
 
      //const newUser = await prisma.user.create({
      //})
    }
});
*/


// Delete
routes.delete('/course/:id', async (req, res) => {
   const { id } = req.params;
   const user = await prisma.user.delete({
      where: {
        id,
        },
      })
      res.json(user)
    //const projectIndex = routes.findIndex(p => p.id == id);
   
    //projects.splice(projectIndex, 1);
   
    return res.send();
   });




// test express operations

/*
routes.get("/", (_, res) => {
    console.log("connect");

    res.status(201).send("Hello World!");
});
*/

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

routes.get("/delay", async (_, res) => {
    await delay(10000);

    res.status(201).send("Delayed");
});

routes.get("/prismatest", async (_, res) => {
    try {
        res.status(201).send(
            `User count from Prisma: ${await prisma.user.count()}`,
        );
    } catch (e) {
        console.error("Error when getting Prisma: " + e);
        res.status(401).send(`Error: ${e}`);
    }
});

export default routes;