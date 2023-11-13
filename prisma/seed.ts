import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seed() {
    // Create sample users
    const user1 = await prisma.user.create({
        data: {
            username: 'user1',
            user_password: 'password1',
        },
    });
    const user2 = await prisma.user.create({
        data: {
            username: 'user2',
            user_password: 'password2',
        },
    });

    // Create sample courses
    const course1 = await prisma.course.create({
        data: {
            title: 'Course 1',
        },
    });
    const course2 = await prisma.course.create({
        data: {
            title: 'Course 2',
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
            title: 'Assignment 1',
            description: 'Description of Assignment 1',
            code_template: 'Your code template here',
            due_date: new Date(),
            course_id: course1.course_id,
            programming_language: 'JavaScript',
        },
    });
    const assignmentSolution1 = await prisma.assignmentSolution.create({
        data: {
            assignment_id: assignment1.assignment_id,
            user_id: user1.user_id,
            solution: 'Sample solution 1',
            feedback: 'Feedback for solution 1',
        },
    });

    console.log('Sample data seeded successfully.');

    await prisma.$disconnect();
}

seed().catch((error) => {
    console.error('Error seeding data:', error);
});
