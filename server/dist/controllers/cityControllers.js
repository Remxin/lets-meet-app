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
exports.getCities = exports.addCity = void 0;
//@ts-nocheck
const City = require("../models/City");
const { verifyUser } = require("../helpers/auth");
const addCity = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield verifyUser(req.cookies.jwt);
        if (!user)
            return res.send({ err: "cannot verify user" });
        console.log(req.body);
        const { cityName, country, localizationString, state } = JSON.parse(req.body);
        console.log(cityName, country, localizationString, state);
        if (!cityName, !country, !localizationString, !state)
            return res.send({ err: "Missing elements in body" });
        yield City.create({ name: cityName, country, localizationString, state });
        return res.send({ msg: "Success!" });
    }
    catch (err) {
        return res.send({ err });
    }
});
exports.addCity = addCity;
const getCities = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield verifyUser(req.cookies.jwt);
        if (!user)
            return res.send({ err: "cannot verify user" });
        const citiesRes = yield City.find();
        return res.send(citiesRes);
    }
    catch (err) {
        return res.send({ err });
    }
});
exports.getCities = getCities;
