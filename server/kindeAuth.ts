import {
  createKindeServerClient,
  GrantType,
  type SessionManager,
  type UserType,
} from "@kinde-oss/kinde-typescript-sdk";
import { Request, Response, NextFunction } from "express";
import "dotenv/config";
import { z } from "zod";
import { UserInfo } from "./sharedTypes";

const KindeEnv = z.object({
  KINDE_DOMAIN: z.string(),
  KINDE_CLIENT_ID: z.string(),
  KINDE_CLIENT_SECRET: z.string(),
  KINDE_REDIRECT_URI: z.string().url(),
  KINDE_LOGOUT_REDIRECT_URI: z.string().url(),
});

const ProcessEnv = KindeEnv.parse(process.env);

export const kindeClient = createKindeServerClient(
  GrantType.AUTHORIZATION_CODE,
  {
    authDomain: process.env.KINDE_DOMAIN!,
    clientId: process.env.KINDE_CLIENT_ID!,
    clientSecret: process.env.KINDE_CLIENT_SECRET!,
    redirectURL: process.env.KINDE_REDIRECT_URI!,
    logoutRedirectURL: process.env.KINDE_LOGOUT_REDIRECT_URI!,
  },
);

export const sessionManager = (
  req: Request,
  res: Response,
): SessionManager => ({
  async getSessionItem(key: string) {
    const result = req.cookies[key];
    return result ? JSON.parse(result) : null;
  },
  async setSessionItem(key: string, value: unknown) {
    const cookieOptions = {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
    } as const;
    res.cookie(key, JSON.stringify(value), cookieOptions);
  },
  async removeSessionItem(key: string) {
    res.clearCookie(key);
  },
  async destroySession() {
    ["id_token", "access_token", "user", "refresh_token"].forEach((key) => {
      res.clearCookie(key);
    });
  },
});

export async function getUser(
  req: UserInfo,
  res: Response,
  next: NextFunction,
) {
  try {
    const manager = sessionManager(req, res);
    const isAuthenticated = await kindeClient.isAuthenticated(manager);
    if (!isAuthenticated) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const user = await kindeClient.getUserProfile(manager);
    req.user = user;
    next();
  } catch (e) {
    console.error(e);
    return res.status(401).json({ error: "Unauthorized" });
  }
}
