import dotenv from "dotenv";

const dotEnvResult = dotenv.config();

if (dotEnvResult.error) {
  throw dotEnvResult.error;
}

import express from "express";
import * as http from "http";

import * as winston from "winston";
import * as expressWinston from "express-winston";

import cors from "cors";
import debug from "debug";
import helmet from "helmet";

import { rateLimit } from "express-rate-limit";

import { CommonRoutesConfig } from "./common/common.routes.config";
import { UsersRoute } from "./users/users.routes.config";
import { AuthRoutes } from "./auth/auth.routes.config";
import { JobsRoute } from "./jobs/jobs.routes.config";

const app: express.Application = express();

app.use(express.json());
app.use(cors());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: "draft-7",
  legacyHeaders: false,
});

app.use(limiter);

app.use(helmet());

const loggerOptions: expressWinston.LoggerOptions = {
  transports: [new winston.transports.Console()],
  format: winston.format.combine(
    winston.format.json(),
    winston.format.prettyPrint(),
    winston.format.colorize({ all: true })
  ),
};

if (!process.env.DEBUG) {
  loggerOptions.meta = false;
  // if (typeof global.it === 'function') {
  //   loggerOptions.level = 'http';
  // }
}

app.use(expressWinston.logger(loggerOptions));

const routes: CommonRoutesConfig[] = [];

routes.push(new UsersRoute(app));
routes.push(new AuthRoutes(app));
routes.push(new JobsRoute(app));

const PORT = process.env.PORT || 3000;
const runningMessage = `Server is running at localhost:${PORT}`;

app.get("/", (req: express.Request, res: express.Response) => {
  res.status(200).send(runningMessage);
});

const debugLog: debug.IDebugger = debug("app");
const server: http.Server = http.createServer(app);

export default server;

server.listen(PORT, () => {
  routes.forEach((route: CommonRoutesConfig) => {
    debugLog(`Routes configured for ${route.getName()}`);
  });

  console.log(runningMessage);
});
