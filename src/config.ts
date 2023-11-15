import { config } from "dotenv";
config(); // Reads from .env

const error = (msg: string) => {
    console.error("Failed: " + msg);
    process.exit(1);
};

export default {
    jwt: {
        jwtSecret: process.env["JWT_SECRET"] || error("No JWT secret supplied"),
        jwtDeadline: process.env["JWT_DEADLINE"] || "1h",
        jwtHeader: process.env["JWT_HEADER"] || "auth-token",
    },
    auth: {
        salt: process.env["PW_SALT"] || 8,
        pw: {
            length: +(process.env["PW_MINLENGTH"] || 8),
            num_count: +(process.env["PW_NUMC_OUNT"] || 1),
            special_count: +(process.env["PW_SPECIAL_COUNT"] || 1),
        },
    },
};
