import express from "express";
import jobsService from "../services/jobs.service";

class JobsMiddleware {
  async extractJobId(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    req.body.id = req.params.jobId;
    next();
  }

  async refUserIsSame(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    const job = await jobsService.readById(req.body.id);
    if (!job) {
      return res.status(404).send();
    }
    if (job.refUserId === res.locals.jwt.userId) {
      next();
    } else {
      return res.status(403).send();
    }
  }
}

export default new JobsMiddleware();
