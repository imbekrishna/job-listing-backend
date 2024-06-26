import express from "express";
import usersService from "../../users/services/users.service";
import * as argon2 from "argon2";

class AuthMiddleware {
  async verifyUserPassword(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    const user: any = await usersService.getUserByEmailWithPassword(
      req.body.email
    );

    if (user) {
      const passwordHash = user.password;
      console.log(user);
      if (await argon2.verify(passwordHash, req.body.password)) {
        req.body = {
          userId: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          permissionFlags: user.permissionFlags,
        };
        return next();
      }
    }
    res.status(400).send({ errors: ["Invalid email and/or password"] });
  }
}

export default new AuthMiddleware();
