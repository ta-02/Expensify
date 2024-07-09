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
const kinde_1 = require("./kinde");
const kinde_2 = require("./kinde");
const authRouter = (0, express_1.Router)();
authRouter.get("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const loginUrl = yield kinde_1.kindeClient.login((0, kinde_1.sessionManager)(req, res));
    return res.redirect(loginUrl.toString());
}));
authRouter.get("/register", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const registerUrl = yield kinde_1.kindeClient.register((0, kinde_1.sessionManager)(req, res));
    return res.redirect(registerUrl.toString());
}));
authRouter.get("/callback", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const url = new URL(`${req.protocol}://${req.get("host")}${req.url}`);
    yield kinde_1.kindeClient.handleRedirectToApp((0, kinde_1.sessionManager)(req, res), url);
    return res.redirect("/");
}));
authRouter.get("/logout", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const logoutUrl = yield kinde_1.kindeClient.logout((0, kinde_1.sessionManager)(req, res));
    return res.redirect(logoutUrl.toString());
}));
authRouter.get("/me", kinde_2.getUser, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    return res.json({ user });
}));
exports.default = authRouter;
