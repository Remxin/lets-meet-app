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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addUserError = exports.addServerError = void 0;
//@ts-ignore
const Error_1 = __importDefault(require("../models/Error"));
const addServerError = (type, text) => {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const error = yield Error_1.default.create({ source: "server", type, text });
            if (!error) {
                resolve({ err: "cannot add error to database" });
            }
            resolve({ msg: "Successfully added error to database" });
        }
        catch (err) {
            reject({ err });
        }
    }));
};
exports.addServerError = addServerError;
const addUserError = (type, text) => {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const error = yield Error_1.default.create({ source: "user reported", type, text });
            if (!error) {
                resolve({ err: "cannot add error to database" });
            }
            resolve({ msg: "Successfully added error to database" });
        }
        catch (err) {
            reject({ err });
        }
    }));
};
exports.addUserError = addUserError;
