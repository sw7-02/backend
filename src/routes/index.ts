import Router, { Request, Response } from "express";
import prisma from "../prisma";
import auth from "./auth";
import course from "./course";

const routes = Router();

// enables passing json bodies.
routes.use(Router.json());

routes.use("/course", course);
routes.use("/", auth); //TODO: `/auth` path?

// CRUD for Courses
routes
    .route("/")
    .get(async (req: Request, res: Response) => {
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
    });

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

routes.get("/delay", async (_, res) => {
    await delay(10000);

    res.status(201).send("Delayed");
});

routes.get("/prismatest", async (_, res) => {
    if (!seeded)
        seed();
    try {
        res.status(201).send(
            `User count from Prisma: ${await prisma.user.count()}`,
        );
    } catch (e) {
        console.error("Error when getting Prisma: " + e);
        res.status(401).send(`Error: ${e}`);
    }
});
let seeded: boolean = false;
async function seed() {
    // Create sample users
    const user1 = await prisma.user.create({
        data: {
            username: "user1",
            user_password: "password1",
        },
    });
    const user2 = await prisma.user.create({
        data: {
            username: "user2",
            user_password: "password2",
        },
    });

    // Create sample courses
    const course1 = await prisma.course.create({
        data: {
            title: "Course 1",
        },
    });
    const course2 = await prisma.course.create({
        data: {
            title: "Course 2",
        },
    });

    // Create sample sessions
    const session1 = await prisma.session.create({
        data: {
            title: "Session 1",
            course_id: course1.course_id,
        },
    });

    // Create sample enrollments
    await prisma.enrollment.create({
        data: {
            user_id: user1.user_id,
            course_id: course1.course_id,
            user_role: 0,
            total_points: 5,
        },
    });

    // Example for creating assignments:
    const assignment1 = await prisma.assignment.create({
        data: {
            title: "Assignment 1",
            description: "Description of Assignment 1",
            code_template: "Your code template here",
            due_date: new Date(),
            course_id: course1.course_id,
            programming_language: "JavaScript",
        },
    });
    const assignmentSolution1 = await prisma.assignmentSolution.create({
        data: {
            assignment_id: assignment1.assignment_id,
            user_id: user1.user_id,
            solution: "Sample solution 1",
            feedback: "Feedback for solution 1",
        },
    });

    // Create sample exercises
    const exercise1 = await prisma.exercise.create({
        data: {
            title: "Exercise 1",
            description: "Description of Exercise 1",
            points: 10,
            programming_language: "JavaScript",
            code_template: "Your code template here",
            session_id: session1.session_id,
        },
    });

    // Create sample test cases
    const testCase1 = await prisma.testCase.create({
        data: {
            code: "Test case 1 code",
            is_visible: true,
            exercise_id: exercise1.exercise_id,
        },
    });

    // Create sample hints
    const hint1 = await prisma.hint.create({
        data: {
            description: "Hint 1 description",
            order: 1,
            exercise_id: exercise1.exercise_id,
        },
    });

    // Create sample exercise solutions
    const exerciseSolution1 = await prisma.exerciseSolution.create({
        data: {
            solution: "Sample exercise solution 1",
            is_anonymous: true,
            is_pinned: false,
            exercise_id: exercise1.exercise_id,
            user_id: user1.user_id,
        },
    });

    seeded = true;
    console.log("Sample data seeded successfully.");
}

export default routes;



// TODO: New branch, don't copy .env, but read from docker compose