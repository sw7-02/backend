import * as assert from "assert";
import roleCheck  from "../../src/middlewares/roleCheck";
//import * as jwt from "jsonwebtoken";
import prisma from "../../src/prisma";
import { Request, Response } from "express";
import httpMocks from "node-mocks-http";
import { exhaust, seed } from "../lib/db";
import { generateJWTToken } from "../../src/lib";
import * as jwt from "jsonwebtoken";
import config from "../../src/config";
import { validateJWT } from "../../src/middlewares/validateJWT";


const nxtFunc = () => {};
let response: Response;
let request: Request;

describe("roleCheck testing", function () {
    before("reset request and response, and seed DB", async function () {
        request = httpMocks.createRequest();
        response = httpMocks.createResponse();
        this.timeout(10000)
        //await seed();
    })

    after("purge DB", exhaust);

    it("deny student access", async function () {
        let roles = [1,2];
        let username = "user1";
        let {user_id: userId} = await prisma.user.findFirstOrThrow({
            where: {
                username: username
            }
        })

        request.headers.auth = jwt.sign(
            { userId, username },
            config.jwt.secret,
            {
                expiresIn: config.jwt.deadline,
            },
        );
        validateJWT(request, response, nxtFunc);

        let rolecheck = roleCheck(roles);
        await rolecheck(request, response, nxtFunc);

        assert.equal(
            response.statusCode,
            401,
            "status code not accepted, roleChecker failed to deny student access"
        );
    })

    it("Grant student access", async function (){
        let roles = [0];
        let username = "user1";
        let {user_id: userId} = await prisma.user.findFirstOrThrow({
            where: {
                username: username
            }
        })

        request.headers.auth = jwt.sign(
            { userId, username },
            config.jwt.secret,
            {
                expiresIn: config.jwt.deadline,
            },
        );
        validateJWT(request, response, nxtFunc);

        let rolecheck = roleCheck(roles);
        await rolecheck(request, response, nxtFunc);

        assert.equal(
            response.statusCode,
            200,
            "status code not accepted, roleChecker failed to grant student access"
        )

    })

    it("Grant teacher access", async function (){
        let roles = [1]
        let username = "user2";
        let {user_id: userId} = await prisma.user.findFirstOrThrow({
            where: {
                username: username
            }
        })

        request.headers.auth = jwt.sign(
            { userId, username },
            config.jwt.secret,
            {
                expiresIn: config.jwt.deadline,
            },
        );
        validateJWT(request, response, nxtFunc);

        let rolecheck = roleCheck(roles);
        await rolecheck(request, response, nxtFunc);

        assert.equal(
            response.statusCode,
            200,
            "status code not accepted, roleChecker failed to grant teacher access"
        )
    })

    it("Deny teacher access", async function () {
        let roles = [0,2];
        let username = "user2";
        let {user_id: userId} = await prisma.user.findFirstOrThrow({
            where: {
                username: username
            }
        })

        request.headers.auth = jwt.sign(
            { userId, username },
            config.jwt.secret,
            {
                expiresIn: config.jwt.deadline,
            },
        );
        validateJWT(request, response, nxtFunc);

        let rolecheck = roleCheck(roles);
        await rolecheck(request, response, nxtFunc);

        assert.equal(
            response.statusCode,
            401,
            "status code not accepted, roleChecker failed to deny teacher access"
        );
    })
})
