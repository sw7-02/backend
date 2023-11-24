import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcryptjs";
import prisma from "./prisma";

export async function seed() {
    // Create sample users
    let salt = bcrypt.genSaltSync(5);
    const user1 = await prisma.user.create({
        data: {
            username: "user1",
            user_password: await bcrypt.hash("password1@", salt),
            pw_salt: salt,
        },
    });

    salt = bcrypt.genSaltSync(5);
    const user2 = await prisma.user.create({
        data: {
            username: "user2",
            user_password: await bcrypt.hash("password2@", salt),
            pw_salt: salt,
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
            exercise_id: exercise1.exercise_id,
            user_id: user1.user_id,
        },
    });

    console.log("Sample data seeded successfully.");

    await prisma.$disconnect();
}

/*
seed().catch((error) => {
    console.error("Err seeding data:", error);
});
 */

export async function exhaust() {
    prisma.user.deleteMany();
    prisma.enrollment.deleteMany();

    prisma.course.deleteMany();
    prisma.session.deleteMany();

    prisma.exercise.deleteMany();
    prisma.exerciseSolution.deleteMany();
    prisma.hint.deleteMany();
    prisma.testCase.deleteMany();

    prisma.assignment.deleteMany();
    prisma.assignmentSolution.deleteMany();
}
