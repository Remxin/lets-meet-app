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
const emailHelpers_1 = require("../helpers/emailHelpers");
const User = require("../models/User");
const UserPreferences = require("../models/UserPreferences");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv").config(); // for using process.env variables
// ----- variables and non export functions -----
const jwtAge = 5 * 24 * 60 * 60;
const alertErr = (err) => {
    // this errors will occure bcs of User model manually built function login
    let errors = { name: "", password: "", email: "" };
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
        Object.values(err.errors).forEach(({ properties }) => {
            // @ts-ignore
            errors[properties.path] = properties.message;
        });
    }
    return errors;
};
// ----- export functions -----
const signup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("signup");
    const { name, email, password, sex, age } = req.body;
    try {
        const user = yield User.register({ name, email, password, sex, age });
        const token = jwt.sign({ id: user._id }, process.env.JWT_TOKEN, {
            expiresIn: jwtAge + "s",
        });
        console.log(user);
        console.log(UserPreferences);
        const preferences = yield UserPreferences.create({ userId: user._id });
        console.log(preferences);
        // console.log(user);
        const emailRes = yield (0, emailHelpers_1.sendWelcomeEmail)(user.email, user.name); // wysyłanie emaila powitalnego
        if (emailRes) {
            // sprawdzenie, czy nie ma błędu w wysyłaniu emaila
            console.log(`Error in sending email to: ${user.email}`);
        }
        res.cookie("jwt", token, { httpOnly: true, maxAge: jwtAge * 1000 });
        if (user.role === "admin") {
            const adminToken = jwt.sign({ id: user._id, email: user.email }, process.env.ADMIN_TOKEN, {
                expiresIn: jwtAge + "s",
            });
            res.cookie("jwtA", adminToken, { httpOnly: true, maxAge: jwtAge * 1000 });
        }
        res.status(201).json({ user });
    }
    catch (error) {
        let errors = alertErr(error);
        res.status(400).json({ errors });
    }
});
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        const user = yield User.login(email, password); //executing our created login function (located in User model), it'll throw err if something went wrong, so then catch will execute
        const token = jwt.sign({ id: user._id }, process.env.JWT_TOKEN, {
            expiresIn: jwtAge + "s",
        });
        // @ts-ignore
        res.cookie("jwt", token, { expiresIn: jwtAge * 1000, httpOnly: true });
        if (user.role === "admin") {
            const adminToken = jwt.sign({ id: user._id, email: user.email }, process.env.ADMIN_TOKEN, {
                expiresIn: jwtAge + "s",
            });
            res.cookie("jwtA", adminToken, { httpOnly: true, maxAge: jwtAge * 1000 });
        }
        res.status(201).json({ user });
    }
    catch (err) {
        let errors = alertErr(err); // alert function will set errors
        res.status(400).json({ errors });
    }
});
const verifyuser = (req, res, next) => {
    const token = req.cookies.jwt;
    // console.log(token);
    if (token) {
        jwt.verify(token, process.env.JWT_TOKEN, (err, decodedToken) => __awaiter(void 0, void 0, void 0, function* () {
            if (err) {
                // console.log("tutaj");
                // console.log(err.message);
            }
            else {
                let user = yield User.findById(decodedToken.id);
                res.json(user);
                next();
            }
        }));
    }
    else {
        next();
    }
};
const logout = (req, res) => {
    if (req.cookies.Ajwt) {
        res.cookie("jwt", "", { maxAge: 1 }).cookie("Ajwt", "", { maxAge: 1 });
    }
    else {
        res.cookie("jwt", "", { maxAge: 1 });
    }
    res.status(200).json({ logout: true });
};
module.exports = { signup, login, logout, verifyuser };
