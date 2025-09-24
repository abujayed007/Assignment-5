import express, { Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { router } from "./app/routes";
import { globalErrorHandler } from "./app/middlewares/globalErrorHandler";
import notFound from "./app/middlewares/notFound";

export const app = express();

app.use(express.json());

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://digital-wallet-frontend-lake.vercel.app",
      "https://digital-wallet-frontend-abujayed007-abujayed007s-projects.vercel.app",
    ],
    credentials: true,
  })
);

app.use(cookieParser());
app.use("/api/v1", router);

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: "Welcome to Digital wallet Backend",
  });
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use(globalErrorHandler);

app.use(notFound);
