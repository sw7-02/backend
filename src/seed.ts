import * as bcrypt from "bcryptjs";
import prisma from "./prisma";

//const prisma = new PrismaClient();

export default async function seed() {
    // Create sample users
    let salt = bcrypt.genSaltSync(5);
    const teacher = await prisma.user.create({
        data: {
            username: "teacher",
            user_password: await bcrypt.hash("teacher1@", salt),
            is_teacher: true,
        },
    });
    const user1 = await prisma.user.create({
        data: {
            username: "user1",
            user_password: await bcrypt.hash("password1@", salt),
        },
    });
    const user2 = await prisma.user.create({
        data: {
            username: "user2",
            user_password: await bcrypt.hash("password2@", salt),
        },
    });
    const user3 = await prisma.user.create({
        data: {
            username: "user3",
            user_password: await bcrypt.hash("password3@", salt),
        },
    });
    const user4 = await prisma.user.create({
        data: {
            username: "user4",
            user_password: await bcrypt.hash("password4@", salt),
        },
    });
    const user5 = await prisma.user.create({
        data: {
            username: "user5",
            user_password: await bcrypt.hash("password5@", salt),
        },
    });
    const user6 = await prisma.user.create({
        data: {
            username: "user6",
            user_password: await bcrypt.hash("password6@", salt),
        },
    });
    const user7 = await prisma.user.create({
        data: {
            username: "user7",
            user_password: await bcrypt.hash("password7@", salt),
        },
    });
    const user8 = await prisma.user.create({
        data: {
            username: "user8",
            user_password: await bcrypt.hash("password8@", salt),
        },
    });

    // Create sample courses
    const course1 = await prisma.course.create({
        data: {
            title: "Imperative Programming",
        },
    });
    const course2 = await prisma.course.create({
        data: {
            title: "Programming Paradigms",
        },
    });
    const course3 = await prisma.course.create({
        data: {
            title: "Object-Oriented Programming",
        },
    });

    // Create sample sessions
    const session1 = await prisma.session.create({
        data: {
            title: "Introduction",
            course_id: course1.course_id,
        },
    });
    await prisma.session.create({
        data: {
            title: "Selective Control Structures",
            course_id: course1.course_id,
        },
    });
    await prisma.session.create({
        data: {
            title: "Iterative Control Structures",
            course_id: course1.course_id,
        },
    });
    await prisma.session.create({
        data: {
            title: "Function and Top-Down Programming",
            course_id: course1.course_id,
        },
    });
    await prisma.session.create({
        data: {
            title: "Functions and Parameters",
            course_id: course1.course_id,
        },
    });
    const session6 = await prisma.session.create({
        data: {
            title: "Arrays and Pointers",
            course_id: course1.course_id,
        },
    });
    const session7 = await prisma.session.create({
        data: {
            title: "Data Types and Testing",
            course_id: course1.course_id,
        },
    });
    await prisma.session.create({
        data: {
            title: "Characters and Stringsss",
            course_id: course1.course_id,
        },
    });
    await prisma.session.create({
        data: {
            title: "Data Structures - Structs",
            course_id: course1.course_id,
        },
    });
    await prisma.session.create({
        data: {
            title: "Recursion",
            course_id: course1.course_id,
        },
    });
    await prisma.session.create({
        data: {
            title: "Input/Output and Files",
            course_id: course1.course_id,
        },
    });
    await prisma.session.create({
        data: {
            title: "Dynamic Data Structures - Lists and Trees",
            course_id: course1.course_id,
        },
    });
    await prisma.session.create({
        data: {
            title: "Dynamic Data Structures - Lists and Trees",
            course_id: course1.course_id,
        },
    });

    // Create sample student enrollment
    await prisma.enrollment.create({
        data: {
            user_id: user1.user_id,
            course_id: course1.course_id,
            user_role: 0,
            is_anonymous: false,
            total_points: 0,
        },
    });
    await prisma.enrollment.create({
        data: {
            user_id: user2.user_id,
            course_id: course1.course_id,
            user_role: 0,
            is_anonymous: false,
            total_points: 25,
        },
    });
    await prisma.enrollment.create({
        data: {
            user_id: user3.user_id,
            course_id: course1.course_id,
            user_role: 0,
            is_anonymous: false,
            total_points: 20,
        },
    });
    await prisma.enrollment.create({
        data: {
            user_id: user4.user_id,
            course_id: course1.course_id,
            user_role: 0,
            is_anonymous: false,
            total_points: 8,
        },
    });
    await prisma.enrollment.create({
        data: {
            user_id: user5.user_id,
            course_id: course1.course_id,
            user_role: 0,
            is_anonymous: false,
            total_points: 50,
        },
    });
    await prisma.enrollment.create({
        data: {
            user_id: user6.user_id,
            course_id: course1.course_id,
            user_role: 0,
            is_anonymous: false,
            total_points: 3,
        },
    });
    await prisma.enrollment.create({
        data: {
            user_id: user7.user_id,
            course_id: course1.course_id,
            user_role: 0,
            is_anonymous: false,
            total_points: 0,
        },
    });
    // Create sample teacher enrollment
    await prisma.enrollment.create({
        data: {
            user_id: teacher.user_id,
            course_id: course1.course_id,
            user_role: 1,
        },
    });
    await prisma.enrollment.create({
        data: {
            user_id: teacher.user_id,
            course_id: course2.course_id,
            user_role: 1,
        },
    });
    await prisma.enrollment.create({
        data: {
            user_id: teacher.user_id,
            course_id: course3.course_id,
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

    await prisma.enrollment.create({
        data: {
            user_id: user8.user_id,
            course_id: course1.course_id,
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
    await prisma.assignmentSolution.create({
        data: {
            assignment_id: assignment1.assignment_id,
            user_id: user1.user_id,
            solution: "Sample solution 1",
            feedback: "Feedback for solution 1",
        },
    });
    await prisma.assignmentSolution.create({
        data: {
            assignment_id: assignment1.assignment_id,
            user_id: user2.user_id,
            solution: "solution from user2",
        },
    });

    // Create sample exercises
    const exercise1 = await prisma.exercise.create({
        data: {
            title: "Hello world",
            description:
                "Write a program that prints 'Hello World' to the console.",
            points: 3,
            programming_language: "C",
            code_template: "",
            session_id: session1.session_id,
        },
    });
    await prisma.exercise.create({
        data: {
            title: "Some Exercise",
            description: "",
            points: 1,
            programming_language: "C",
            code_template: "",
            session_id: session1.session_id,
        },
    });
    await prisma.exercise.create({
        data: {
            title: "Another Exercise",
            description: "",
            points: 1,
            programming_language: "C",
            code_template: "",
            session_id: session1.session_id,
        },
    });
    await prisma.exercise.create({
        data: {
            title: "Yet Another Exercise",
            description: "",
            points: 1,
            programming_language: "C",
            code_template: "",
            session_id: session1.session_id,
        },
    });
    const exercise2 = await prisma.exercise.create({
        data: {
            title: "Add two numbers",
            description:
                "Write a program that adds two numbers and returns the result.",
            points: 5,
            programming_language: "C",
            code_template: "int addTwoNumbers(int a, int b) {\n\n}",
            session_id: session7.session_id,
        },
    });
    await prisma.exercise.create({
        data: {
            title: "Some Exercise",
            description: "",
            points: 1,
            programming_language: "C",
            code_template: "",
            session_id: session7.session_id,
        },
    });
    await prisma.exercise.create({
        data: {
            title: "Another Exercise",
            description: "",
            points: 1,
            programming_language: "C",
            code_template: "",
            session_id: session7.session_id,
        },
    });
    prisma.exercise.create({
        data: {
            title: "Yet Another Exercise",
            description: "",
            points: 1,
            programming_language: "C",
            code_template: "",
            session_id: session7.session_id,
        },
    });

    const exercise9 = await prisma.exercise.create({
        data: {
            title: "Sum of Int Array",
            description:
                "Find the sum of all the elements in an array of integers.",
            points: 10,
            programming_language: "C",
            code_template:
                "int sumArray(const int array[], size_t length){\n\n}",
            session_id: session6.session_id,
        },
    });

    // Create sample test cases
    await prisma.testCase.create({
        data: {
            code: `void testPrintHelloWorld() {
                // Redirect stdout to capture the printed output
                freopen("test_output.txt", "w", stdout);

                // Call the function to be tested
                printHelloWorld();

                // Close the redirected stdout
                fclose(stdout);

                // Open the redirected stdout for reading
                FILE *fp = fopen("test_output.txt", "r");
                if (fp != NULL) {
                    char buffer[100];
                    // Read the printed output
                    fgets(buffer, sizeof(buffer), fp);
                    // Check if the output matches the expected string
                    CU_ASSERT_STRING_EQUAL(buffer, "Hello, World!\n");
                    // Close the file
                    fclose(fp);
                } else {
                    CU_FAIL("Failed to open test_output.txt");
                }
            }`,
            exercise_id: exercise1.exercise_id,
        },
    });
    await prisma.testCase.create({
        data: {
            code: `CU_ASSERT(addTwoNumbers(1, 2) == 3);`,
            exercise_id: exercise2.exercise_id,
        },
    });

    await prisma.testCase.create({
        data: {
            code: `int testArray[] = {1, 2, 3, 4, 5};
            CU_ASSERT_EQUAL(sumArray(testArray, sizeof(testArray) / sizeof(testArray[0])), 15);`,
            exercise_id: exercise9.exercise_id,
        },
    });

    await prisma.testCase.create({
        data: {
            code: `int testArray[] = {1};
            CU_ASSERT_EQUAL(sumArray(testArray, sizeof(testArray) / sizeof(testArray[0])), 1);`,
            exercise_id: exercise9.exercise_id,
        },
    });

    // Create sample hints
    await prisma.hint.create({
        data: {
            description:
                "You can use the printf function to print to the console.",
            order: 1,
            exercise_id: exercise1.exercise_id,
        },
    });
    await prisma.hint.create({
        data: {
            description: "Use quotation marks to print a string.",
            order: 1,
            exercise_id: exercise1.exercise_id,
        },
    });
    await prisma.hint.create({
        data: {
            description: "Use the + operator to add two numbers.",
            order: 1,
            exercise_id: exercise2.exercise_id,
        },
    });
    await prisma.hint.create({
        data: {
            description: "Use the return keyword to return the result.",
            order: 1,
            exercise_id: exercise2.exercise_id,
        },
    });

    await prisma.hint.create({
        data: {
            description: "Use the return keyword to return the result.",
            order: 1,
            exercise_id: exercise2.exercise_id,
        },
    });

    await prisma.hint.create({
        data: {
            description:
                "You can use a for-loop to loop over the elements in an array.",
            order: 1,
            exercise_id: exercise9.exercise_id,
        },
    });

    // Create sample examples
    await prisma.example.create({
        data: {
            input: "addTwoNumbers(2, 2)",
            output: "4",
            exercise_id: exercise2.exercise_id,
            example_id: 1,
        },
    });
    await prisma.example.create({
        data: {
            input: "addTwoNumbers(4, 5)",
            output: "9",
            exercise_id: exercise2.exercise_id,
            example_id: 2,
        },
    });

    await prisma.example.create({
        data: {
            input: "[1,2,3,4,5]",
            output: "15",
            exercise_id: exercise9.exercise_id,
            example_id: 3,
        },
    });

    await prisma.example.create({
        data: {
            input: "[1]",
            output: "1",
            exercise_id: exercise9.exercise_id,
            example_id: 4,
        },
    });

    // Create sample exercise solutions
    await prisma.exerciseSolution.create({
        data: {
            solution: "Sample exercise solution 1",
            exercise_id: exercise1.exercise_id,
            user_id: user1.user_id,
        },
    });

    for (let i = 9; i <= 200; i++) {
        let salt = bcrypt.genSaltSync(5);
        const user = await prisma.user.create({
            data: {
                username: `user${i}`,
                user_password: await bcrypt.hash(`password${i}@`, salt),
            },
        });
        await prisma.enrollment.create({
            data: {
                user_id: user.user_id,
                course_id: course1.course_id,
                user_role: 0,
                is_anonymous: Math.round(Math.random()) == 1,
                total_points: Math.floor(Math.random() * 20),
            },
        });
    }
    console.log("Sample data seeded successfully.");
}
