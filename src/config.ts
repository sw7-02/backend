export default {
    jwt: {
        jwtSecret: process.env["JWT-SECRET"] || "@SECRET$",
        jwtDeadline: process.env["JWT-DEADLINE"] || "1h",
    },
};