import express, { Express, Request, Response } from "express";
import morgan from "morgan";
import bodyParser from "body-parser";
import router from "./router";
import path from "path";

const app: Express = express();
app.use(morgan("dev"));
app.use(bodyParser.json());

app.use("/api/expenses", router);

app.use(express.static(path.join(__dirname, "../frontend/dist")));

app.get("*", (req: Request, res: Response) => {
  res.sendFile(path.resolve(__dirname, "../frontend/dist/index.html"));
});

export default app;
