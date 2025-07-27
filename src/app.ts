import express, { Application } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import errorHandler from "./middlewares/error.middleware";

const app: Application = express();

// ? Middleware
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());

const options = {
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "UPDATE"],
  credential: true,
};
app.use(cors(options));

// Import Router

import authRouter from "./routes/auth.route";

app.use("/api/v1/auth", authRouter);

// Custom Error Handler

app.use(errorHandler);

export default app;
