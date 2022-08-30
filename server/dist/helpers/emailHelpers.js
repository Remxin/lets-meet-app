"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendForgotPasswordEmail = exports.sendWelcomeEmail = void 0;
const nodemailer = require("nodemailer");
const dotenv = require("dotenv").config();
const path = require("path");
const Handlebars = require("handlebars");
const fs = require("fs");
// ----- email config -----
const transporter = nodemailer.createTransport({
    service: "yahoo",
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASSWORD,
    },
});
// ----- export functions -----
const sendWelcomeEmail = (userEmail, userName) => {
    // console.log(
    //   process.env.GMAIL_HOST,
    //   process.env.GMAIL_PORT,
    //   process.env.GMAIL_USER,
    //   process.env.GMAIL_PASSWORD
    // );
    let error = false;
    const sourceFile = fs.readFileSync(path.join(__dirname, "../views/email/welcome.hbs"), "utf-8"); // setting template
    const template = Handlebars.compile(sourceFile);
    const templateVars = {
        userName,
    };
    // -- declaring email options --
    const mailOptions = {
        from: `Lets Meet App <${process.env.GMAIL_USER}>`,
        to: userEmail,
        subject: `Welcome ${userName}!`,
        html: template(templateVars),
    };
    transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
            error = true;
            console.log(err);
            return "error";
        }
        console.log("success");
        return "success";
    });
    return error;
};
exports.sendWelcomeEmail = sendWelcomeEmail;
const sendForgotPasswordEmail = (userEmail, userName, resetPasswordToken // secret to verify reset password link
) => {
    let error = false;
    const sourceFile = fs.readFileSync(path.join(__dirname, "../views/email/forgotEmail.hbs"), "utf-8"); // setting template
    const template = Handlebars.compile(sourceFile);
    const templateVars = {
        userName,
        resetPasswordToken,
        userEmail,
        clientIP: process.env.CLIENT_IP,
    };
    // -- declaring email options --
    const mailOptions = {
        from: `Lets Meet App <${process.env.GMAIL_USER}>`,
        to: userEmail,
        subject: `Reset your password`,
        html: template(templateVars),
    };
    transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
            error = true;
            return "error";
        }
        return "success";
    });
    return error;
};
exports.sendForgotPasswordEmail = sendForgotPasswordEmail;
