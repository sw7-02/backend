import prisma from "../prisma";
import { Err, Result } from "../lib";
import CourseController from "./CourseController";

type _AssignmentIdentifier = {
    assignment_id: number;
    title: string;
    due_date: Date;
};

type _Assignment = {
    assignment_id: number;
    title: string;
    description: string;
    code_template: string;
    due_date: Date;
};

type _AssignmentSolution = {
    assignment_id: number;
    solution: string;
    username: string;
};

export default class AssignmentController {
    static retrieveAllAssignments = async (
        courseId: number,
    ): Promise<Result<_AssignmentIdentifier[]>> => // TODO: Identifier?
        prisma.assignment
            .findMany({
                where: {
                    course_id: courseId,
                },
                select: {
                    assignment_id: true,
                    title: true,
                    due_date: true,
                },
            })
            .then(
                (res) => res,
                (r) => {
                    console.error(
                        `Failure getting Assignment in course ${courseId}: ${r}`,
                    );
                    return new Err(404, "Course does not exist");
                },
            );

    static retrieveAssignment = async (
        assignmentId: number,
    ): Promise<Result<_Assignment>> =>
        prisma.assignment
            .findUniqueOrThrow({
                where: {
                    assignment_id: assignmentId,
                },
                select: {
                    assignment_id: true,
                    title: true,
                    description: true,
                    code_template: true,
                    due_date: true,
                },
            })
            .then(
                (res) => res,
                (r) => {
                    console.error(
                        `Failure getting assignment ${assignmentId}: ${r}`,
                    );
                    return new Err(404, "Assignment does not exist");
                },
            );

    static submitAssignementSolution = async (
        assignmentId: number,
        userId: number,
        solution: string,
    ): Promise<Result<void>> =>
        prisma.assignmentSolution
            .upsert({
                where: {
                    user_id_assignment_id: {
                        user_id: userId,
                        assignment_id: assignmentId,
                    },
                },
                update: { solution, feedback: "" },
                create: {
                    assignment_id: assignmentId,
                    user_id: userId,
                    solution,
                    feedback: "",
                },
            })
            .then(
                () => {},
                (r) => {
                    console.error(
                        `Failure submitting assignment ${assignmentId}: ${r}`,
                    );
                    return new Err(500, "Internal error"); //TODO: What happens?
                },
            );

    static retrieveAllAssignmentSolutions = async (
        assignmentId: number,
    ): Promise<Result<_AssignmentSolution[]>> =>
        prisma.assignmentSolution
            .findMany({
                where: {
                    assignment_id: assignmentId,
                },
                select: {
                    assignment_id: true,
                    solution: true,
                    user: {
                        select: {
                            username: true,
                        },
                    },
                },
            })
            .then(
                (res) =>
                    res.map((r) => {
                        const { solution, assignment_id } = r;
                        return {
                            assignment_id,
                            solution,
                            username: r.user.username,
                        };
                    }),
                (r) => {
                    console.error(
                        `Failure getting assignment ${assignmentId}: ${r}`,
                    );
                    return new Err(404, "Assignment does not exist");
                },
            );
    static retrieveAssignmentFeedback = async (
        assignmentId: number,
        username: string,
    ): Promise<Result<string>> =>
        prisma.assignmentSolution
            .findFirstOrThrow({
                where: {
                    assignment_id: assignmentId,
                    user: {
                        username,
                    },
                },
                select: {
                    feedback: true,
                },
            })
            .then(
                (res) =>
                    res.feedback
                        ? res.feedback
                        : new Err(204, "Feedback has not been provided yet"),
                (r) => {
                    console.error(
                        `Failure getting assignment solution from ${username} for assignment ${assignmentId}: ${r}`,
                    );
                    return new Err(404, "Assignment solution does not exist");
                },
            );
    static postAssignmentFeedback = async (
        assignmentId: number,
        courseId: number,
        username: string,
        feedback: string,
    ): Promise<Result<void>> => {
        let userId = await CourseController.getUserId(courseId, username);
        if (userId instanceof Err) {
            console.error(`User ${username} not in course ${courseId}`);
            return userId;
        }
        prisma.assignmentSolution
            .update({
                where: {
                    user_id_assignment_id: {
                        assignment_id: assignmentId,
                        user_id: userId,
                    },
                },
                data: {
                    feedback,
                },
            })
            .then(
                (res) => res,
                (r) => {
                    console.error(
                        `Failure getting assignment solution from ${username} for assignment ${assignmentId}: ${r}`,
                    );
                    return new Err(404, "Assignment solution does not exist");
                },
            );
    };
}
