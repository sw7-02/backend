import { PrismaClient, Prisma } from "@prisma/client";
import * as bcrypt from "bcryptjs";
import config from "../../src/config";
import prisma from "../../src/prisma";

//const prisma = new PrismaClient();

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
    const teacher = await prisma.user.create({
        data: {
            username: "teacher",
            user_password: await bcrypt.hash("teacher1@", salt),
            pw_salt: salt,
            is_teacher: true,
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

    // Create sample student enrollment
    await prisma.enrollment.create({
        data: {
            user_id: user1.user_id,
            course_id: course1.course_id,
            user_role: 0,
            total_points: 5,
        },
    });
    // Create sample teacher enrollment
    await prisma.enrollment.create({
        data: {
            user_id: user2.user_id,
            course_id: course1.course_id,
            user_role: 0,
            total_points: 2,
        },
    });
    await prisma.enrollment.create({
        data: {
            user_id: teacher.user_id,
            course_id: course1.course_id,
            user_role: 1,
        },
    });
    // Create sample TA enrollment
    await prisma.enrollment.create({
        data: {
            user_id: user1.user_id,
            course_id: course2.course_id,
            user_role: 2,
        },
    });

    // Example for creating assignments:
    const assignment1 = await prisma.assignment.create({
        data: {
            title: "Assignment 1",
            description: "Description of Assignment 1",
            code_template: "Your code template here",
            due_date: new Date("2023-12-21"),
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
    const assignmentSolution2 = await prisma.assignmentSolution.create({
        data: {
            assignment_id: assignment1.assignment_id,
            user_id: user2.user_id,
            solution: "solution from user2",
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

    // Create sample examples
    const example1 = await prisma.example.create({
        data: {
            input: "[1, 2, 3]",
            output: "6",
            exercise_id: exercise1.exercise_id,
        },
    });

    const example2 = await prisma.example.create({
        data: {
            input: "[3, 4, 7]",
            output: "14",
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
}

export async function exhaust() {
    await prisma.assignmentSolution.deleteMany({});
    await prisma.assignment.deleteMany({});
    await prisma.enrollment.deleteMany({});
    await prisma.exerciseSolution.deleteMany({});
    await prisma.hint.deleteMany({});
    await prisma.testCase.deleteMany({});
    await prisma.exercise.deleteMany({});
    await prisma.session.deleteMany({});
    await prisma.course.deleteMany({});
    await prisma.user.deleteMany({});
}
