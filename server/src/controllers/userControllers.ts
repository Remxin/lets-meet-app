//@ts-nocheck
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv").config();
const path = require("path");
const fs = require("fs");

const User = require("../models/User");
const {verifyUser} = require("../helpers/auth")
import { sendForgotPasswordEmail } from "../helpers/emailHelpers";

export const forgotPassword = async (req: Request, res: Response) => {
  const { secret, email } = req.body;
  try {
    if (secret !== process.env.FORGOT_PASSWORD_SECRET) {
      return res
        .status(403)
        .send({ err: "You don't have permissions to perform this action" });
    }
    const userInfo = await User.findOne({ email });
    const resetPasswordToken: string = jwt.sign(
      { id: userInfo.id, email: userInfo.email },
      process.env.RESET_PASSWORD_TOKEN,
      { expiresIn: 15 + "m" }
    );
    console.log(userInfo);
    const emailError = sendForgotPasswordEmail(
      userInfo.email,
      userInfo.name,
      resetPasswordToken
    );
    if (emailError) {
      return res
        .status(500)
        .send({ err: "Internal server error - cannot send email to user" });
    }
    return res
      .status(200)
      .send({ msg: "Reset password email successfully sended" });
  } catch (err) {
    return res.status(400).send({ err: "Bad request" });
  }
};

export const verifyUserFromEmailLink = (req: Request, res: Response) => {
  const { resetToken } = req.body;
  jwt.verify(
    resetToken,
    process.env.RESET_PASSWORD_TOKEN,
    (err: Error, decodedUserInfo: any) => {
      if (err) {
        return res
          .status(403)
          .send({ err: "You don't have permissions to perform this action" });
      }
      return res.status(200).send({ msg: "Successfully verified user" });
    }
  );
};

export const changeUserPassword = (req: Request, res: Response) => {
  const { emailToken, newPassword } = req.body;
  try {
    jwt.verify(
      emailToken,
      process.env.RESET_PASSWORD_TOKEN,
      async (err: Error, decodedUser: any) => {
        if (err) {
          return res
            .status(403)
            .send({ err: "You don't have permissions to perform this action" });
        }
        const { email, id } = decodedUser;
        const userInfo = await User.findOne({ _id: id });
        console.log(userInfo);
        userInfo.password = newPassword;
        userInfo
          .save()
          .then(() => {
            return res
              .status(200)
              .send({ msg: "Successfully updated user password" });
          })
          .catch((err) => {
            return res.status(500).send({
              err: "Internal server error - cannot change user password",
            });
          });
      }
    );
  } catch (err) {
    return res.status(400).send({ err: "Bad request" });
  }
};

export const addAvatar = (req: Request, res: Response) => {
  const user = req.cookies.jwt;

  console.log(req.files);
  try {
    jwt.verify(user, process.env.JWT_TOKEN, (err: Error, decodedUser: any) => {
      if (err) {
        return res
          .status(403)
          .send({ err: "You don't have permissions to perform this action" });
      }

      const file = req.files?.file;
      console.log(file);
      if (file) {
        const fileExt = file.name.split(".").pop();
        // ----- usuwanie plikow o takiej samej nazwie -----
        const dir = path.join(__dirname, "/../static/uploads/avatars");
        const files = fs.readdirSync(dir);

        for (const file of files) {
          console.log(file);
          let filename = file + "";
          if (filename.includes(decodedUser.id)) {
            fs.unlinkSync(`${__dirname}/../static/uploads/avatars/${filename}`);
          }
        }
        // ----- właściwe dodawanie pliku -----
        file.mv(
          `${__dirname}/../static/uploads/avatars/${decodedUser.id}.${fileExt}`,
          (err: Error) => {
            if (err) {
              return res
                .status(500)
                .send({ err: "Internal server error - cannot save file" });
            }
            return res.status(200).send({ msg: "Successfully saved file" });
          }
        );
      }
      // return res.status(400).send({ err: "Error - no file has been sent" });
    });
  } catch (err) {
    console.log(err);
    return res.status(400).send({ err });
  }
};

export const getAvatar = async (req, res) => {
  const user = req.cookies?.jwt;
  const id = req?.query?.userId
  if (user) {

      const decodedUser = await verifyUser(user)
      console.log(decodedUser)
      if (decodedUser.err) {
        return res.status(403).send({err: "You don't have permissions to perform this action"})
      }

        // --- właściwe pobieranie zdjęcia ---
        console.log(id)
        const dir = path.join(__dirname, "/../static/uploads/avatars");
        const files = fs.readdirSync(dir);

        for (const file of files) {
          let filename = file + "";
          if (filename.includes(id)) {
            return res.sendFile(
              path.join(__dirname + `/../static/uploads/avatars/${filename}`)
            );
          }
        }
        return res.sendFile(
          path.join(__dirname + "/../static/uploads/avatars/default.png")
        );
        
  } else {
    return res.send({ err: "user unauthorized" });
  }
};
