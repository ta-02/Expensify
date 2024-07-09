"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sessionManager = exports.kindeClient = void 0;
exports.getUser = getUser;
const kinde_typescript_sdk_1 = require("@kinde-oss/kinde-typescript-sdk");
const dotenv = __importStar(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv.config({ path: path_1.default.resolve(__dirname, "../.env") });
exports.kindeClient = (0, kinde_typescript_sdk_1.createKindeServerClient)(kinde_typescript_sdk_1.GrantType.AUTHORIZATION_CODE, {
    authDomain: process.env.KINDE_DOMAIN,
    clientId: process.env.KINDE_CLIENT_ID,
    clientSecret: process.env.KINDE_CLIENT_SECRET,
    redirectURL: process.env.KINDE_REDIRECT_URI,
    logoutRedirectURL: process.env.KINDE_LOGOUT_REDIRECT_URI,
});
let store = {};
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
                sameSite: "Lax",
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
// type Env = {
//   Variables: {
//     user: UserType;
//   };
// };
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
