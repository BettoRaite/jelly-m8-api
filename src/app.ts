import express, { Request, type Express, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import cookieParser from "cookie-parser";
import compressFilter from "./lib/utils/compressFilter.util";
import router from "./routes";
import errorHandler from "./middleware/errorHandler";
import config from "./lib/config/config";
import authLimiter from "./middleware/authLimiter";
import { xssMiddleware } from "./middleware/xssMiddleware";
import corsConfig from "./lib/config/cors";
import createAuthMiddleware from "./middleware/auth";
import httpStatus from "http-status";
import path from "node:path";

const app: Express = express();

// Helmet is used to secure this app by configuring the http-header
app.use(helmet.frameguard({ action: "deny" }));

// parse json request body
app.use(
  express.json({
    type: ["application/json"],
  }),
);

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

app.use(xssMiddleware());

app.use(cookieParser());

// Compression is used to reduce the size of the response body
app.use(compression({ filter: compressFilter }));
app.use(cors(corsConfig));

if (config.node_env === "production") {
  app.use("/api/v1/auth", authLimiter);
}

app.use("/api/v1", router);

app.get(
  "/sacret-place",
  createAuthMiddleware("admin"),
  (_: Request, res: Response) => {
    res.status(httpStatus.OK).json({
      message: "Hello there!",
    });
  },
);

app.use(errorHandler);

app.all("*", (req, res) => {
  res.status(404);
  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "views", "404.html"));
  } else if (req.accepts("json")) {
    res.json({ error: "404 Not Found" });
  } else {
    res.type("txt").send("404 Not Found");
  }
});

export default app;
