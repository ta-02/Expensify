import * as dotenv from "dotenv";
import app from "./app";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, "../.env") });

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
