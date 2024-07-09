"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
    getSessionItem(key) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = req.cookies[key];
            return result ? JSON.parse(result) : null;
        });
    },
    setSessionItem(key, value) {
        return __awaiter(this, void 0, void 0, function* () {
            const cookieOptions = {
                httpOnly: true,
                secure: true,
                sameSite: "lax",
            };
            res.cookie(key, JSON.stringify(value), cookieOptions);
        });
    },
    removeSessionItem(key) {
        return __awaiter(this, void 0, void 0, function* () {
            res.clearCookie(key);
        });
    },
    destroySession() {
        return __awaiter(this, void 0, void 0, function* () {
            ["id_token", "access_token", "user", "refresh_token"].forEach((key) => {
                res.clearCookie(key);
            });
        });
    },
});
exports.sessionManager = sessionManager;
function getUser(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const manager = (0, exports.sessionManager)(req, res);
            const isAuthenticated = yield exports.kindeClient.isAuthenticated(manager);
            if (!isAuthenticated) {
                return res.status(401).json({ error: "Unauthorized" });
            }
            const user = yield exports.kindeClient.getUserProfile(manager);
            req.user = user;
            next();
        }
        catch (e) {
            console.error(e);
            return res.status(401).json({ error: "Unauthorized" });
        }
    });
}
