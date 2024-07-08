import { Router } from "express";
import { kindeClient, sessionManager } from "./kinde";

const authRouter = Router();

authRouter.get("/login", async (req, res) => {
  const loginUrl = await kindeClient.login(sessionManager);
  return res.redirect(loginUrl.toString());
});

authRouter.get("/register", async (req, res) => {
  const registerUrl = await kindeClient.register(sessionManager);
  return res.redirect(registerUrl.toString());
});

authRouter.get("/callback", async (req, res) => {
  const url = new URL(`${req.protocol}://${req.get("host")}${req.url}`);
  await kindeClient.handleRedirectToApp(sessionManager, url);
  return res.redirect("/");
});

authRouter.get("/logout", async (req, res) => {
  const logoutUrl = await kindeClient.logout(sessionManager);
  return res.redirect(logoutUrl.toString());
});

authRouter.get("/me", async (req, res) => {
  const isAuthenticated = await kindeClient.isAuthenticated(sessionManager); // Boolean: true or false
  if (isAuthenticated) {
    return res.json(isAuthenticated);
  } else {
    // Need to implement, e.g: redirect user to sign in, etc..
  }
});

export default authRouter;
