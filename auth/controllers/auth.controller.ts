import express from "express";
import debug from "debug";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const log: debug.IDebugger = debug("app:auth-controller");

const jwtSecret: string = process.env.JWT_SECRET!;
const tokenExpirationInSeconds = 36000;

class AuthController {
  async createJWT(req: express.Request, res: express.Response) {
    try {
      const refreshId = req.body.userId + jwtSecret;
      const salt = crypto.createSecretKey(crypto.randomBytes(16));

      const hash = crypto
        .createHmac("sha512", salt)
        .update(refreshId)
        .digest("base64");

      req.body.refreshKey = salt.export();

      const token = jwt.sign(req.body, jwtSecret, {
        expiresIn: tokenExpirationInSeconds,
      });

      /* 
        1. accessToken - For protected routes
        2. refreshToken - For long sessions
        3. firstName & lastName - To display on frontend profile
        4. permissionFlag - To control who can see addNew form.
        5. userId|id - To show edit/delete buttons on info page
      */
      return res.status(201).send({
        id: req.body.userId,
        accessToken: token,
        refreshToken: hash,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        permissionFlags: req.body.permissionFlags,
      });
    } catch (error) {
      log("createJWT error: %0", error);

      return res.status(500).send();
    }
  }
}

export default new AuthController();
