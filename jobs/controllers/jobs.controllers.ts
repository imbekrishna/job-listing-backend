import express from "express";
import jobsService from "../services/jobs.service";
import debug from "debug";

const log: debug.IDebugger = debug("app:jobs-controller");

class JobsController {
  async listJobs(req: express.Request, res: express.Response) {
    const jobs = await jobsService.list(100, 0);
    res.status(200).send(jobs);
  }

  async getJobById(req: express.Request, res: express.Response) {
    const job = await jobsService.readById(req.body.id);
    res.status(200).send(job);
  }

  async createJob(req: express.Request, res: express.Response) {
    const userId = res.locals.user.id;
    const jobId = await jobsService.create({ ...req.body, refUserId: userId });
    res.status(201).send({ id: jobId });
  }

  async patch(req: express.Request, res: express.Response) {
    await jobsService.patchById(req.body.id, req.body);
    res.status(204).send();
  }

  async put(req: express.Request, res: express.Response) {
    await jobsService.putById(req.body.id, req.body);
    res.status(204).send();
  }

  async removeJob(req: express.Request, res: express.Response) {
    await jobsService.deleteById(req.body.id);
    res.status(204).send();
  }
}

export default new JobsController();
