import { Router } from "express";
import { kindeClient, sessionManager } from "./kinde";

const authRouter = Router();

authRouter.get("/login", async (req, res) => {
  const loginUrl = await kindeClient.login(sessionManager(req, res));
  return res.redirect(loginUrl.toString());
});

authRouter.get("/register", async (req, res) => {
  const registerUrl = await kindeClient.register(sessionManager(req, res));
  return res.redirect(registerUrl.toString());
});

authRouter.get("/callback", async (req, res) => {
  const url = new URL(`${req.protocol}://${req.get("host")}${req.url}`);
  await kindeClient.handleRedirectToApp(sessionManager(req, res), url);
  return res.redirect("/");
});

authRouter.get("/logout", async (req, res) => {
  const logoutUrl = await kindeClient.logout(sessionManager(req, res));
  return res.redirect(logoutUrl.toString());
});

authRouter.get("/me", async (req, res) => {
  const isAuthenticated = await kindeClient.isAuthenticated(
    sessionManager(req, res),
  ); // Boolean: true or false
  return res.json(isAuthenticated);
});

export default authRouter;
