import { config } from "dotenv";
config(); // Reads from .env

const error = (msg: string) => {
    console.error("Failed: " + msg);
    process.exit(1);
};

export default {
    jwt: {
        secret: process.env["JWT_SECRET"] || error("No JWT secret supplied"),
        deadline: process.env["JWT_DEADLINE"] || "1h",
        header: process.env["JWT_HEADER"] || "auth",
    },
    server: {
        port: process.env["PORT"] || "8080",
        test_runner:
            "http://" +
            (process.env["TEST_HOST"] || "test-runner") +
            (":" + process.env["TEST_PORT"] || ":8081"),
    },
    auth: {
        pw: {
            length: +(process.env["PW_MIN_LENGTH"] || 8),
            num_count: +(process.env["PW_NUM_COUNT"] || 1),
            special_count: +(process.env["PW_SPECIAL_COUNT"] || 1),
        },
    },
};
