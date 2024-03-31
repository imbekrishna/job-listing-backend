import { CreateJobDto } from "../dto/create.job.dto";
import mongooseService from "../../common/services/mongoose.service";
import { nanoid } from "nanoid";
import debug from "debug";
import { PermissionFlag } from "../../common/middleware/common.permissionflag.enum";
import { PutJobDto } from "../dto/put.job.dto";

const log: debug.IDebugger = debug("app:jobs-dao");

class JobsDao {
  Schema = mongooseService.getMongoose().Schema;

  jobSchema = new this.Schema(
    {
      _id: String,
      company: String,
      logo: String,
      new: { type: Boolean, default: true },
      featured: { type: Boolean, default: false },
      position: String,
      role: String,
      level: String,
      contract: String,
      location: String,
      languages: [String],
      skills: [String],
      aboutCompany: String,
      aboutPosition: String,
      additionalInfo: String,
      refUserId: String,
    },
    { timestamps: { createdAt: "postedAt", updatedAt: "updatedAt" } }
  ).set("toJSON", {
    virtuals: true,
    transform: (doc, item) => {
      delete item._id;
    },
  });

  Job = mongooseService.getMongoose().model("Jobs", this.jobSchema);

  constructor() {
    log("Create new instance of JobsDao");
  }

  async addJob(jobFields: CreateJobDto) {
    const jobId = nanoid();

    const job = new this.Job({
      _id: jobId,
      ...jobFields,
    });

    await job.save();
    return jobId;
  }

  async getJobs(limit = 25, page = 0) {
    return this.Job.find()
      .limit(limit)
      .skip(limit * page)
      .exec();
  }

  async getJobById(jobId: string) {
    return await this.Job.findOne({ _id: jobId });
  }

  async updateJobById(jobId: string, jobFields: PutJobDto) {
    const existingJob = await this.Job.findOneAndUpdate(
      { _id: jobId },
      { $set: jobFields },
      { new: true }
    ).exec();

    return existingJob;
  }

  async removeJobById(jobId: string) {
    return this.Job.findByIdAndDelete(jobId).exec();
  }
}

export default new JobsDao();
