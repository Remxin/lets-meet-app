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
exports.sendOpinion = exports.uploadPlaceImages = exports.getCityPlaces = exports.rejectPlace = exports.verifyPlace = exports.getPlaceImg = exports.placeImgLen = exports.placeCreationRequest = void 0;
//@ts-nocheck
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv").config();
const fs = require('fs');
const Place = require("../models/Place");
const User = require("../models/User");
const Opinion = require("../models/Opinion");
const auth_1 = require("../helpers/auth");
const images_1 = require("../helpers/images");
const placeCreationRequest = (req, res) => {
    const user = req.cookies.jwt;
    try {
        jwt.verify(user, process.env.JWT_TOKEN, (err, decodedUser) => __awaiter(void 0, void 0, void 0, function* () {
            if (err) {
                return res.status(403).send({
                    err: "You don't have right access to perform this action",
                });
            }
            const { name, localizationString, website, description, localizationCords, } = req.body;
            const userId = decodedUser.id;
            yield Place.create({
                name,
                localizationString,
                localizationCords,
                website,
                description,
                userId, // ustawiamy userId na początku na id uzytkownika, który je doda, by wynagrodzić go darmowym punktem promocji wydarzenie za poprawne dodanie miejsca
            }, (err) => {
                if (err) {
                    return res
                        .status(500)
                        .send({ err: "Internal server error - cannot create place" });
                }
                return res
                    .status(200)
                    .send({ msg: "Successfully added new place" });
            });
        }));
    }
    catch (err) {
        console.log(`User cannot send place creation request: ${err}`);
    }
};
exports.placeCreationRequest = placeCreationRequest;
const placeImgLen = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const token = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a.jwt;
    const placeId = (_b = req === null || req === void 0 ? void 0 : req.query) === null || _b === void 0 ? void 0 : _b.placeId;
    if (!placeId) {
        return res.send({ err: "No place id passed" });
    }
    if (!token) {
        return res.send({ err: "User not registered" });
    }
    const user = yield (0, auth_1.verifyUser)(token);
    if (!user) {
        return res.send({ err: "User not verified" });
    }
    const len = yield (0, images_1.getPlaceImageLength)(placeId);
    return res.send({ len });
});
exports.placeImgLen = placeImgLen;
const getPlaceImg = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _c;
    const token = (_c = req.cookies) === null || _c === void 0 ? void 0 : _c.jwt;
    if (!token) {
        return res.send({ err: "User not registered" });
    }
    const user = yield (0, auth_1.verifyUser)(token);
    if (!user) {
        return res.send({ err: "User not verified" });
    }
    const { placeId, photoIndex } = req.query;
    if (!placeId || !photoIndex) {
        return res.send({ err: "Bad request" });
    }
    const image = yield (0, images_1.getPlaceImage)(photoIndex, placeId);
    if (image.err)
        return res.send({ err: "Image index out of range" });
    return res.sendFile(image.path);
});
exports.getPlaceImg = getPlaceImg;
const verifyPlace = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _d;
    if (!((_d = req.cookies) === null || _d === void 0 ? void 0 : _d.jwtA)) {
        return res.send({ err: "You don't have permissions to perform this action" });
    }
    let admin = yield (0, auth_1.verifyAdmin)(req.cookies.jwtA);
    // console.log(admin)
    if (admin.err) {
        return res.send({ err: "You don't have permissions to perform this action" });
    }
    const placeId = JSON.parse(req.body).placeId;
    const place = yield Place.findOne({ _id: placeId });
    if (!place) {
        return res.send({ err: "Cannot find this place!" });
    }
    const addingUserId = place.userId;
    place.verified = true;
    place.userId = ""; // teraz ustawiam na puste, poniewaz tutaj będzie oficjalne konto miejsca, jeśli będzie chciało
    yield place
        .save() // aktualizowanie statusu miejsca na verified
        .then(() => __awaiter(void 0, void 0, void 0, function* () {
        if (addingUserId) {
            const addingUserInfo = yield User.findOne({ _id: addingUserId }); // dodawanie userowi za nagrodę darmową promocję eventu
            console.log(addingUserId, addingUserInfo);
            addingUserInfo.promotionEvents += 0.25; // promotion events given to user
            addingUserInfo
                .save()
                .then(() => {
                return res
                    .status(200)
                    .send({ msg: "Successfully verified place" });
            })
                .catch((err) => {
                console.log(`Adding promotion event points to user ${addingUserId} failed - give him manually`); // nalezy dodać uzytkownikowi 1 darmowy punkt promocji wydarzenia manualnie i sprawdzic, co jest nie tak z serwerem
                return res.status(500).send({
                    err: "Internal server error - place successfully added, but user promotion points do not increase - administrator will give them manually",
                });
            });
        }
        return res.send({ msg: "Success" });
    }));
});
exports.verifyPlace = verifyPlace;
const rejectPlace = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _e;
    const token = (_e = req.cookies) === null || _e === void 0 ? void 0 : _e.jwtA;
    if (!token) {
        return res.send({ err: "User not verified!" });
    }
    const admin = yield (0, auth_1.verifyAdmin)(token);
    if (!admin) {
        return res.send({ err: "You don't have permissions to perform this action" });
    }
    const placeId = JSON.parse(req.body).placeId;
    if (!placeId) {
        return res.send({ err: "Bad request" });
    }
    try {
        // deleting document
        yield Place.deleteOne({ _id: placeId });
        const deleted = yield (0, images_1.deletePlaceImageFolder)(placeId);
        if (deleted.err) {
            res.send({ err: "Deleted Place, but cannot deleted its image folder" });
        }
        return res.send({ msg: "Successfully detelet document" });
    }
    catch (err) {
        console.log(err);
        return res.send({ err: "Error in deleting document" });
    }
});
exports.rejectPlace = rejectPlace;
const getCityPlaces = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _f;
    const token = (_f = req.cookies) === null || _f === void 0 ? void 0 : _f.jwt;
    if (!token) {
        return res.send({ err: "User not verified!" });
    }
    const user = yield (0, auth_1.verifyUser)(token);
    if (!user) {
        return res.send({ err: "User not verified" });
    }
    const cityId = JSON.parse(req.body).cityId;
    if (!cityId) {
        const returnCities = yield Place.find({ verified: true });
        return res.send(returnCities);
    }
    const returnCities = yield Place.find({ cityId, verified: true });
    return res.send(returnCities);
});
exports.getCityPlaces = getCityPlaces;
const uploadPlaceImages = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _g;
    const token = (_g = req.cookies) === null || _g === void 0 ? void 0 : _g.jwt;
    if (!token)
        return res.send({ err: "User not verified" });
    const user = yield (0, auth_1.verifyUser)(token);
    if (!user)
        return res.send({ err: "User not verified" });
    let files = req.files;
    const data = JSON.parse(req.body.jsondatarequest);
    const { name, address, website, cityId, localizationString, description, imagesLen } = data;
    const filesArr = [];
    for (let i = 0; i < imagesLen; i++) {
        filesArr.push(files["file" + i]);
    }
    const place = yield Place.create({ name, addressString: address, website, cityId, localizationString, description, user: user.id });
    // console.log(place)
    let localizationDir = `${__dirname}/../static/uploads/places/${place._id}`;
    if (!fs.existsSync(localizationDir)) {
        fs.mkdirSync(localizationDir);
    }
    let incrementer = 0;
    for (let file of filesArr) {
        const ext = file.name.split(".").pop();
        const res = yield (0, images_1.saveImage)(file, localizationDir + "/" + incrementer + "." + ext);
        if (res.err)
            return res.send({ err: "error in saving files" });
        incrementer++;
    }
    return res.send({ msg: "Success!" });
});
exports.uploadPlaceImages = uploadPlaceImages;
const sendOpinion = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { jwt } = req.cookies;
    const user = yield (0, auth_1.verifyUser)(jwt);
    if (!user)
        return res.send({ err: "user not verified" });
    const { placeId, comment, stars } = JSON.parse(req.body);
    try {
        const opinion = yield Opinion.create({ userId: user.id, placeId, comment, stars });
        const placeOpinions = yield Opinion.find({ placeId });
        console.log(opinion);
        // calculating stars
        const sum = placeOpinions.reduce((a, b) => {
            return a + b.stars;
        }, 0);
        // average rating + rounding value
        let avg = (sum / placeOpinions.length);
        avg = Math.floor(avg * 10) / 10;
        yield Place.findOneAndUpdate({ _id: placeId }, { opinionStars: avg }, {
            new: true,
            upsert: true
        });
        return res.send({ msg: "opinion successfully sended" });
    }
    catch (err) {
        return res.send({ err: "Internal server error" });
    }
});
exports.sendOpinion = sendOpinion;
