"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const kindeAuth_1 = require("./kindeAuth");
const authRouter = (0, express_1.Router)();
authRouter.get("/login", async (req, res) => {
    const loginUrl = await kindeAuth_1.kindeClient.login((0, kindeAuth_1.sessionManager)(req, res));
    res.redirect(loginUrl.toString());
});
authRouter.get("/register", async (req, res) => {
    const registerUrl = await kindeAuth_1.kindeClient.register((0, kindeAuth_1.sessionManager)(req, res));
    res.redirect(registerUrl.toString());
});
authRouter.get("/callback", async (req, res) => {
    const url = new URL(`${req.protocol}://${req.get("host")}${req.url}`);
    await kindeAuth_1.kindeClient.handleRedirectToApp((0, kindeAuth_1.sessionManager)(req, res), url);
    res.redirect("/");
});
authRouter.get("/logout", async (req, res) => {
    const logoutUrl = await kindeAuth_1.kindeClient.logout((0, kindeAuth_1.sessionManager)(req, res));
    res.redirect(logoutUrl.toString());
});
authRouter.get("/me", kindeAuth_1.getUser, async (req, res) => {
    const user = req.user;
    res.json({ user });
});
exports.default = authRouter;
