import { authRouter } from "./auth";

authRouter.get("/register", async (req, res) => {
  const registerUrl = await kindeClient.register(sessionManager);
  return res.redirect(registerUrl.toString());
});
