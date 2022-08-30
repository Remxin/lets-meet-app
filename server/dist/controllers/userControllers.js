"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePassword = exports.updateInformations = exports.getAvatar = exports.addAvatar = exports.changeUserPassword = exports.verifyUserFromEmailLink = exports.forgotPassword = void 0;
//@ts-nocheck
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv").config();
const path = require("path");
const fs = require("fs");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const { verifyUser } = require("../helpers/auth");
const emailHelpers_1 = require("../helpers/emailHelpers");
const forgotPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { secret, email } = req.body;
    try {
        if (secret !== process.env.FORGOT_PASSWORD_SECRET) {
            return res
                .status(403)
                .send({ err: "You don't have permissions to perform this action" });
        }
        const userInfo = yield User.findOne({ email });
        if (!userInfo)
            return res.send({ err: "This email account does not exist" });
        const resetPasswordToken = jwt.sign({ id: userInfo.id, email: userInfo.email }, process.env.RESET_PASSWORD_TOKEN, { expiresIn: 15 + "m" });
        console.log(userInfo);
        const emailError = (0, emailHelpers_1.sendForgotPasswordEmail)(userInfo.email, userInfo.name, resetPasswordToken);
        if (emailError) {
            return res
                .status(500)
                .send({ err: "Internal server error - cannot send email to user" });
        }
        return res
            .status(200)
            .send({ msg: "Reset password email successfully sended" });
    }
    catch (err) {
        return res.status(400).send({ err: "Bad request" });
    }
});
exports.forgotPassword = forgotPassword;
const verifyUserFromEmailLink = (req, res) => {
    const { resetToken } = req.body;
    jwt.verify(resetToken, process.env.RESET_PASSWORD_TOKEN, (err, decodedUserInfo) => {
        if (err) {
            return res
                .status(403)
                .send({ err: "You don't have permissions to perform this action" });
        }
        return res.status(200).send({ msg: "Successfully verified user" });
    });
};
exports.verifyUserFromEmailLink = verifyUserFromEmailLink;
const changeUserPassword = (req, res) => {
    const { emailToken, newPassword } = req.body;
    try {
        jwt.verify(emailToken, process.env.RESET_PASSWORD_TOKEN, (err, decodedUser) => __awaiter(void 0, void 0, void 0, function* () {
            if (err) {
                return res
                    .status(403)
                    .send({ err: "You don't have permissions to perform this action" });
            }
            const { email, id } = decodedUser;
            const userInfo = yield User.findOne({ _id: id });
            console.log(userInfo);
            const salt = yield bcrypt.genSalt();
            const hashedPass = yield bcrypt.hash(newPassword, salt);
            userInfo.password = hashedPass;
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
        }));
    }
    catch (err) {
        return res.status(400).send({ err: "Bad request" });
    }
};
exports.changeUserPassword = changeUserPassword;
const addAvatar = (req, res) => {
    const user = req.cookies.jwt;
    console.log(req.files);
    try {
        jwt.verify(user, process.env.JWT_TOKEN, (err, decodedUser) => {
            var _a;
            if (err) {
                return res
                    .status(403)
                    .send({ err: "You don't have permissions to perform this action" });
            }
            const file = (_a = req.files) === null || _a === void 0 ? void 0 : _a.file;
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
                file.mv(`${__dirname}/../static/uploads/avatars/${decodedUser.id}.${fileExt}`, (err) => {
                    if (err) {
                        return res
                            .status(500)
                            .send({ err: "Internal server error - cannot save file" });
                    }
                    return res.status(200).send({ msg: "Successfully saved file" });
                });
            }
            // return res.status(400).send({ err: "Error - no file has been sent" });
        });
    }
    catch (err) {
        console.log(err);
        return res.status(400).send({ err });
    }
};
exports.addAvatar = addAvatar;
const getAvatar = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const user = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a.jwt;
    let id = (_b = req === null || req === void 0 ? void 0 : req.query) === null || _b === void 0 ? void 0 : _b.userId;
    if (user) {
        const decodedUser = yield verifyUser(user);
        if (decodedUser.err) {
            return res.status(403).send({ err: "You don't have permissions to perform this action" });
        }
        // --- właściwe pobieranie zdjęcia ---
        console.log(id);
        const dir = path.join(__dirname, "/../static/uploads/avatars");
        const files = fs.readdirSync(dir);
        for (const file of files) {
            let filename = file + "";
            if (filename.includes(id)) {
                return res.sendFile(path.join(__dirname + `/../static/uploads/avatars/${filename}`));
            }
        }
        return res.sendFile(path.join(__dirname + "/../static/uploads/avatars/default.png"));
    }
    else {
        return res.send({ err: "user unauthorized" });
    }
});
exports.getAvatar = getAvatar;
const updateInformations = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { jwt } = req.cookies;
    const user = yield verifyUser(jwt);
    if (!user)
        return res.send({ err: "You don't have permissions to perform this action" });
    const userData = yield User.findById(user.id);
    if (!userData)
        return res.send({ err: "Internal server error - cannot find user" });
    const { name, sex, age } = JSON.parse(req.body);
    userData.name = name;
    userData.sex = sex;
    userData.age = age;
    try {
        yield userData.save();
    }
    catch (err) {
        return res.send({ err: "Internal server error" });
    }
    return res.send({ msg: "Successfully updated user data" });
});
exports.updateInformations = updateInformations;
const updatePassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { jwt } = req.cookies;
    // console.log(jwt);
    const user = yield verifyUser(jwt);
    if (!user)
        return res.send({ err: "Cannot verify user" });
    const userData = yield User.findById(user.id);
    const { prevPass, password } = JSON.parse(req.body);
    try {
        const passwordIsTheSame = yield bcrypt.compare(prevPass, userData.password);
        if (!passwordIsTheSame)
            return res.send({ err: "Wrong previous password!" });
    }
    catch (err) {
        return res.send({ err: "Internal server error" });
    }
    const salt = yield bcrypt.genSalt();
    const hashedPass = yield bcrypt.hash(password, salt);
    userData.password = hashedPass;
    yield userData.save();
    return res.send({ msg: "Success" });
});
exports.updatePassword = updatePassword;
