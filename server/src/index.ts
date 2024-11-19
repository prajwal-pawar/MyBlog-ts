import express, { Express } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import env from "./configs/environment";
import connectToMongodb from "./configs/mongoose";
import routes from "./routes";

const app: Express = express();
const PORT = env.port;

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(cookieParser());
app.use("/", routes);

app.listen(PORT, () => {
  console.log(`Server is listening to port ${PORT}`);
  connectToMongodb();
});
