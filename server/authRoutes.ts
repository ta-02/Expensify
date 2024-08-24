import { Router, Request, Response, NextFunction } from "express";
import { getUser, kindeClient, sessionManager } from "./kindeAuth";
import { UserInfo } from "./sharedTypes";

const authRouter = Router();

authRouter.get("/login", async (req: Request, res: Response) => {
  const loginUrl = await kindeClient.login(sessionManager(req, res));
  res.redirect(loginUrl.toString());
});

authRouter.get("/register", async (req: Request, res: Response) => {
  const registerUrl = await kindeClient.register(sessionManager(req, res));
  res.redirect(registerUrl.toString());
});

authRouter.get("/callback", async (req: Request, res: Response) => {
  const url = new URL(`${req.protocol}://${req.get("host")}${req.url}`);
  await kindeClient.handleRedirectToApp(sessionManager(req, res), url);
  res.redirect("/");
});

authRouter.get("/logout", async (req: Request, res: Response) => {
  const logoutUrl = await kindeClient.logout(sessionManager(req, res));
  res.redirect(logoutUrl.toString());
});

authRouter.get("/me", getUser, async (req: UserInfo, res: Response) => {
  const user = req.user;
  res.json({ user });
});

export default authRouter;
