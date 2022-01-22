// ----- imports -----
import { Request, Response, NextFunction } from "express";

const User = require("../models/User");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv").config(); // for using process.env variables

// ----- variables and non export functions -----
const jwtAge = 5 * 24 * 60 * 60;
const alertErr = (err: any) => {
  // this errors will occure bcs of User model manually built function login
  let errors: any = { name: "", password: "", email: "" };

  if (err.message === "incorrect email") {
    errors.name = "Did not found email";
  }
  if (err.message === "incorrect password") {
    errors.password = "Incorrect password";
  }
  if (err.code === 11000) {
    errors.email = "This email is already registered";
  }
  if (err.message.includes("user validation failed")) {
    Object.values(err.errors).forEach(({ properties }: any) => {
      // @ts-ignore
      errors[properties.path] = properties.message;
    });
  }
  return errors;
};

// return jwt.sign({ id: id }, process.env.JTW_TOKEN, { expiresIn: jwtAge + "s" }) // jsonweb token expires in 5 days
// ----- export functions -----

const signup = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  try {
    const user = await User.create({ name, email, password });
    // const token = createJWT(user._id);
    const token = jwt.sign({ id: user._id }, process.env.JWT_TOKEN, {
      expiresIn: jwtAge + "s",
    });
    console.log(user);
    res.cookie("jwt", token, { httpOnly: true, maxAge: jwtAge * 1000 });
    res.status(201).json({ user });
  } catch (error) {
    let errors = alertErr(error);
    // res.sendStatus(400).json({ errors })
    res.status(400).json({ errors });
  }
};

const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const user = await User.login(email, password); //executing our created login function (located in User model), it'll throw err if something went wrong, so then catch will execute
    const token = jwt.sign({ id: user._id }, process.env.JWT_TOKEN, {
      expiresIn: jwtAge + "s",
    });
    if (user.role === "admin") {
      const adminToken = jwt.sign(
        { id: user._id },
        process.env.JWT_ADMIN_TOKEN,
        { expiresIn: jwtAge + "s" }
      );
      //@ts-ignore
      res
        .cookie("Ajwt", adminToken, {
          //@ts-ignore
          expiresIn: jwtAge * 1000,
          httpOnly: true,
        })
        //@ts-ignore
        .cookie("jwt", token, { expiresIn: jwtAge * 1000, httpOnly: true });
    } else {
      // @ts-ignore
      res.cookie("jwt", token, { expiresIn: jwtAge * 1000, httpOnly: true });
    }
    res.status(201).json({ user });
  } catch (err) {
    let errors = alertErr(err); // alert function will set errors
    res.status(400).json({ errors });
  }
};

const verifyuser = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.jwt;
  // console.log(token)
  if (token) {
    jwt.verify(
      token,
      process.env.JWT_TOKEN,
      async (err: any, decodedToken: any) => {
        if (err) {
          console.log("tutaj");
          console.log(err.message);
        } else {
          let user = await User.findById(decodedToken.id);
          res.json(user);
          next();
        }
      }
    );
  } else {
    next();
  }
};

const logout = (req: Request, res: Response) => {
  if (req.cookies.Ajwt) {
    res.cookie("jwt", "", { maxAge: 1 }).cookie("Ajwt", "", { maxAge: 1 });
  } else {
    res.cookie("jwt", "", { maxAge: 1 });
  }
  res.status(200).json({ logout: true });
};

module.exports = { signup, login, logout, verifyuser };
