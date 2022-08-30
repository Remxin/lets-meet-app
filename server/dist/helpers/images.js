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
exports.saveImage = exports.deletePlaceImageFolder = exports.getPlaceImage = exports.getPlaceImageLength = void 0;
const fs = require("fs");
const path = require("path");
const getPlaceImageLength = (imageId) => {
    return new Promise((resolve, reject) => {
        try {
            const dir = path.join(__dirname, "/../static/uploads/places/" + imageId);
            const files = fs.readdirSync(dir);
            resolve(files.length);
        }
        catch (err) {
            reject({ err });
        }
    });
};
exports.getPlaceImageLength = getPlaceImageLength;
const getPlaceImage = (index, imageId) => {
    return new Promise((resolve, reject) => {
        try {
            const dir = path.join(__dirname, "/../static/uploads/places/" + imageId);
            const files = fs.readdirSync(dir);
            console.log(files.length - 1, +index);
            if (+index > files.length - 1) {
                resolve({ err: "Bad index" });
            }
            resolve({ path: dir + "/" + files[index] });
        }
        catch (err) {
            reject({ err });
        }
    });
};
exports.getPlaceImage = getPlaceImage;
const deletePlaceImageFolder = (imageId) => {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield fs.rmSync(path.join(__dirname, "/../static/uploads/places/", imageId), { recursive: true, force: true });
            resolve({ msg: "Successfully deleted folder" });
        }
        catch (err) {
            reject({ err });
        }
    }));
};
exports.deletePlaceImageFolder = deletePlaceImageFolder;
const saveImage = (image, imageLocation) => {
    return new Promise((resolve, reject) => {
        try {
            image.mv(imageLocation, (err) => {
                if (err)
                    resolve({ err });
                resolve({ msg: "success" });
            });
        }
        catch (err) {
            reject({ err });
        }
    });
};
exports.saveImage = saveImage;
