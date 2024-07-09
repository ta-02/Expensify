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
const express_1 = require("express");
const kindeAuth_1 = require("./kindeAuth");
const authRouter = (0, express_1.Router)();
authRouter.get("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const loginUrl = yield kindeAuth_1.kindeClient.login((0, kindeAuth_1.sessionManager)(req, res));
    res.redirect(loginUrl.toString());
}));
authRouter.get("/register", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const registerUrl = yield kindeAuth_1.kindeClient.register((0, kindeAuth_1.sessionManager)(req, res));
    res.redirect(registerUrl.toString());
}));
authRouter.get("/callback", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const url = new URL(`${req.protocol}://${req.get("host")}${req.url}`);
    yield kindeAuth_1.kindeClient.handleRedirectToApp((0, kindeAuth_1.sessionManager)(req, res), url);
    res.redirect("/");
}));
authRouter.get("/logout", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const logoutUrl = yield kindeAuth_1.kindeClient.logout((0, kindeAuth_1.sessionManager)(req, res));
    res.redirect(logoutUrl.toString());
}));
authRouter.get("/me", kindeAuth_1.getUser, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    res.json({ user });
}));
exports.default = authRouter;
