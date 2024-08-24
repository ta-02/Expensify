"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sessionManager = exports.kindeClient = void 0;
exports.getUser = getUser;
const kinde_typescript_sdk_1 = require("@kinde-oss/kinde-typescript-sdk");
require("dotenv/config");
const zod_1 = require("zod");
const KindeEnv = zod_1.z.object({
    KINDE_DOMAIN: zod_1.z.string(),
    KINDE_CLIENT_ID: zod_1.z.string(),
    KINDE_CLIENT_SECRET: zod_1.z.string(),
    KINDE_REDIRECT_URI: zod_1.z.string().url(),
    KINDE_LOGOUT_REDIRECT_URI: zod_1.z.string().url(),
});
const ProcessEnv = KindeEnv.parse(process.env);
exports.kindeClient = (0, kinde_typescript_sdk_1.createKindeServerClient)(kinde_typescript_sdk_1.GrantType.AUTHORIZATION_CODE, {
    authDomain: process.env.KINDE_DOMAIN,
    clientId: process.env.KINDE_CLIENT_ID,
    clientSecret: process.env.KINDE_CLIENT_SECRET,
    redirectURL: process.env.KINDE_REDIRECT_URI,
    logoutRedirectURL: process.env.KINDE_LOGOUT_REDIRECT_URI,
});
const sessionManager = (req, res) => ({
    async getSessionItem(key) {
        const result = req.cookies[key];
        return result ? JSON.parse(result) : null;
    },
    async setSessionItem(key, value) {
        const cookieOptions = {
            httpOnly: true,
            secure: true,
            sameSite: "lax",
        };
        res.cookie(key, JSON.stringify(value), cookieOptions);
    },
    async removeSessionItem(key) {
        res.clearCookie(key);
    },
    async destroySession() {
        ["id_token", "access_token", "user", "refresh_token"].forEach((key) => {
            res.clearCookie(key);
        });
    },
});
exports.sessionManager = sessionManager;
async function getUser(req, res, next) {
    try {
        const manager = (0, exports.sessionManager)(req, res);
        const isAuthenticated = await exports.kindeClient.isAuthenticated(manager);
        if (!isAuthenticated) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        const user = await exports.kindeClient.getUserProfile(manager);
        req.user = user;
        next();
    }
    catch (e) {
        console.error(e);
        return res.status(401).json({ error: "Unauthorized" });
    }
}
