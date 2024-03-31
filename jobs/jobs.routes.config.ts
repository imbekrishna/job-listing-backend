import { CommonRoutesConfig } from "../common/common.routes.config";
import jobsControllers from "./controllers/jobs.controllers";
import express from "express";
import jobsMiddleware from "./middleware/jobs.middleware";
import usersMiddleware from "../users/middleware/users.middleware";
import jwtMiddleware from "../auth/middleware/jwt.middleware";
import permissionMiddleware from "../common/middleware/common.permission.middleware";
import {
  createJobValidator,
  putPatchJobValidator,
} from "./middleware/jobs.validators.middleware";
import bodyValidationMiddleware from "../common/middleware/body.validation.middleware";

export class JobsRoute extends CommonRoutesConfig {
  constructor(app: express.Application) {
    super(app, "UsersRoutes");
  }

  configureRoutes(): express.Application {
    this.app
      .route("/jobs")
      .get(jobsControllers.listJobs)
      .post(
        createJobValidator,
        bodyValidationMiddleware.verifyBodyFieldsErrors,
        jwtMiddleware.validJWTNeeded,
        usersMiddleware.validateUserExists,
        permissionMiddleware.onlyRecruiterOrAdminCanDoThisAction,
        jobsControllers.createJob
      );

    this.app.param("jobId", jobsMiddleware.extractJobId);

    this.app.route("/jobs/:jobId").get(jobsControllers.getJobById);

    this.app
      .route("/jobs/:jobId")
      .all(
        jwtMiddleware.validJWTNeeded,
        usersMiddleware.validateUserExists,
        permissionMiddleware.onlyRecruiterOrAdminCanDoThisAction,
        jobsMiddleware.refUserIsSame
      )
      .delete(jobsControllers.removeJob)
      .put(
        putPatchJobValidator,
        bodyValidationMiddleware.verifyBodyFieldsErrors,
        jobsControllers.put
      )
      .patch(
        putPatchJobValidator,
        bodyValidationMiddleware.verifyBodyFieldsErrors,
        jobsControllers.patch
      );

    return this.app;
  }
}
