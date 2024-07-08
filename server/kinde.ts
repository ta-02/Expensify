import {
  createKindeServerClient,
  GrantType,
  SessionManager,
} from "@kinde-oss/kinde-typescript-sdk";
import * as dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, "../.env") });

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

let store: Record<string, unknown> = {};

export const sessionManager = (req: any, res: any): SessionManager => ({
  async getSessionItem(key: string) {
    const result = req.cookies[key];
    return result ? JSON.parse(result) : null;
  },
  async setSessionItem(key: string, value: unknown) {
    const cookieOptions = {
      httpOnly: true,
      secure: true,
      sameSite: "Lax",
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
