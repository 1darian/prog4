import { makeApp } from "./app";
import dotenv from "dotenv";
dotenv.config();

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const app = makeApp();

app.listen(PORT, () => {
  console.log(` Server running on http://localhost:${PORT}`);
});
