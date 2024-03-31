import { CreateUserDto } from "../dto/create.user.dto";
import { PatchUserDto } from "../dto/patch.user.dto";
import { PutUserDto } from "../dto/put.user.dto";
import mongooseService from "../../common/services/mongoose.service";

import { nanoid } from "nanoid";
import debug from "debug";
import { PermissionFlag } from "../../common/middleware/common.permissionflag.enum";

const log: debug.IDebugger = debug("app:users-dao");

class UsersDao {
  Schema = mongooseService.getMongoose().Schema;

  userSchema = new this.Schema({
    _id: String,
    email: String,
    password: { type: String, select: false },
    firstName: String,
    lastName: String,
    permissionFlags: Number,
  }).set("toJSON", {
    virtuals: true,
    transform: (doc, item) => {
      delete item._id;
    },
  });

  User = mongooseService.getMongoose().model("Users", this.userSchema);

  constructor() {
    log("Created new instance of UsersDao");
  }

  async addUser(userFields: CreateUserDto) {
    const userId = nanoid();

    const user = new this.User({
      _id: userId,
      ...userFields,
      permissionFlags: PermissionFlag.BASIC_PERMISSION,
    });

    await user.save();
    return userId;
  }

  async getUserByEmail(email: string) {
    return this.User.findOne({ email: email }).exec();
  }

  async getUserById(userId: string) {
    return this.User.findOne({ _id: userId }).exec();
  }

  async getUsers(limit = 25, page = 0) {
    return this.User.find()
      .limit(limit)
      .skip(limit * page)
      .exec();
  }

  async updateUserById(userId: string, userFields: PatchUserDto | PutUserDto) {
    const existingUser = await this.User.findOneAndUpdate(
      { _id: userId },
      { $set: userFields },
      { new: true }
    ).exec();

    return existingUser;
  }

  async removeUserById(userId: string) {
    return this.User.findByIdAndDelete(userId).exec();
  }

  async getUserByEmailWithPassword(email: string) {
    return this.User.findOne({ email: email })
      .select([
        "_id",
        "email",
        "permissionFlags",
        "password",
        "firstName",
        "lastName",
      ])
      .exec();
  }
}

export default new UsersDao();
