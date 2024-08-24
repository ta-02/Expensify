import express, { Response, Request } from "express";
import path from "path";
import morgan from "morgan";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import expenseRoutes from "./expenseRoutes";
import authRouter from "./authRoutes";

const app = express();

const middlewares = [
  morgan("dev"),
  bodyParser.json(),
  cookieParser(),
  express.static(path.join(__dirname, "../frontend/dist")),
];

middlewares.forEach((middleware) => app.use(middleware));
app.use("/api", expenseRoutes);
app.use("/api", authRouter);

app.get("*", (_: Request, res: Response) => {
  res.sendFile(path.resolve(__dirname, "../frontend/dist/index.html"));
});

export default app;
