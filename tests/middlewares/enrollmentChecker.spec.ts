import { Request, Response } from "express";
import * as assert from "assert";
import { checkEnrollment } from "../../src/middlewares/enrollmentChecker";
import httpMocks from "node-mocks-http";

const nextFunc = () => {};
const userId = 1;
const username = "user";
const courseId = 2
const title = "IWP";
let response: Response;
let request: Request;

jest.mock('@prisma/client');

// Define the types for mocked Prisma client
const mockedPrisma = PrismaClient as jest.MockedClass<typeof PrismaClient>;

describe('checkEnrollment', () => {
  // Test case for successful enrollment check
  it('should call next() when user is enrolled', async () => {
    const req : Request = {
      params: {
        userId: 'validUserId',
        course_id: 'validCourseId'
      }
    };

    const res = {} as Response;
    const next = jest.fn() as NextFunction;

    // Mock the PrismaClient implementation
    mockedPrisma.enrollment.findUniqueOrThrow.mockResolvedValue({/* mocked enrollment data */});

    await checkEnrollment(req, res, next);

    expect(next).toHaveBeenCalled();
  });

  // Test case for unsuccessful enrollment check
  it('should send a 403 status when user is not enrolled', async () => {
    const req = {
      params: {
        userId: 'invalidUserId',
        course_id: 'invalidCourseId'
      }
    } as Request;

    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn()
    } as unknown as Response;
    const next = jest.fn() as NextFunction;

    // Mock the PrismaClient implementation to throw an error
    mockedPrisma.enrollment.findUniqueOrThrow.mockRejectedValue(new Error('Enrollment not found'));

    await checkEnrollment(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.send).toHaveBeenCalled();
    expect(next).not.toHaveBeenCalled();
  });
});