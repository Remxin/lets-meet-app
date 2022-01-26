const nodemailer = require("nodemailer");
const dotenv = require("dotenv").config();
const path = require("path");
const Handlebars = require("handlebars");
const fs = require("fs");

// ----- email config -----
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  requireTLS: true,
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASSWORD,
  },
});

// ----- export functions -----
export const sendWelcomeEmail = (userEmail: string, userName: string) => {
  let error = false;
  const sourceFile = fs.readFileSync(
    path.join(__dirname, "../views/email/welcome.hbs"),
    "utf-8"
  ); // setting template
  const template = Handlebars.compile(sourceFile);
  const templateVars = {
    userName,
  };
  // -- declaring email options --
  const mailOptions = {
    from: `Lets meet up <${process.env.NODEMAILER_USER}>`,
    to: userEmail,
    subject: `Welcome ${userName}!`,
    html: template(templateVars),
  };

  transporter.sendMail(mailOptions, (err: Error, info: string) => {
    if (err) {
      error = true;
      return "error";
    }
    return "success";
  });

  return error;
};
