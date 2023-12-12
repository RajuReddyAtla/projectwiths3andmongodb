import hpp from "hpp";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import express from "express";
import compression from "compression";
import cookieParser from "cookie-parser";
import errorMiddleware from "@middlewares/error.middleware";
import { LOG_FORMAT, ORIGIN, CREDENTIALS } from "@config";

const app = express();

// CORS
const corsOptions = cors({
  origin: ORIGIN,
  credentials: CREDENTIALS,
  methods: ["GET", "POST", "PUT", "DELETE"],
});
// App Initialization
function initializeApp() {
  app.use(hpp());
  app.use(corsOptions);
  app.use(compression());
  app.use(express.json());
  app.use(cookieParser());
  // app.use(morgan(LOG_FORMAT, { stream, immediate: true }));
  app.use(express.urlencoded({ extended: true }));
  app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));

  // Error Handling
  app.use(errorMiddleware);
}
initializeApp();

export default app;
