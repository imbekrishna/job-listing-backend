import jobsDao from "../dao/jobs.dao";
import { CRUD } from "../../common/interfaces/crud.interface";
import { CreateJobDto } from "../dto/create.job.dto";
import { PutJobDto } from "../dto/put.job.dto";

class JobsService implements CRUD {
  async list(limit: number, page: number) {
    return jobsDao.getJobs(limit, page);
  }

  async create(resource: CreateJobDto) {
    return jobsDao.addJob(resource);
  }

  async readById(id: string) {
    return jobsDao.getJobById(id);
  }

  async putById(id: string, resource: PutJobDto) {
    return jobsDao.updateJobById(id, resource);
  }
  async patchById(id: string, resource: PutJobDto) {
    return jobsDao.updateJobById(id, resource);
  }

  async deleteById(id: string) {
    return jobsDao.removeJobById(id);
  }
}

export default new JobsService();
