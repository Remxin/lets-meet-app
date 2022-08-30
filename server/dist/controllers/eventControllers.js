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
exports.rejectUser = exports.acceptUser = exports.getEventRequests = exports.joinEvent = exports.getEventImage = exports.createEvent = exports.uploadEventImage = void 0;
//@ts-nocheck
const jwt = require("jsonwebtoken");
const path = require("path");
const fs = require("fs");
const auth_1 = require("../helpers/auth");
const Event = require("../models/Event");
const Chat = require("../models/Chat");
const User = require("../models/User");
const JoinRequest = require("../models/JoinRequest");
const UserPreferences = require("../models/UserPreferences");
const uploadEventImage = (req, res) => {
    const user = req.cookies.jwt;
    try {
        jwt.verify(user, process.env.JWT_TOKEN, (err, decodedUser) => {
            var _a;
            if (err) {
                return res
                    .status(403)
                    .send({ err: "You don't have permissions to perform this action" });
            }
            const { eventName, isPublic, premiumEvent, membersRestrictions, place, city, eventDescription, openChat, } = JSON.parse(req.body.jsondataRequest);
            const file = (_a = req.files) === null || _a === void 0 ? void 0 : _a.file;
            if (file) {
                // creating file
                const fileExt = file.name.split(".").pop();
                file.mv(`${__dirname}/../static/uploads/events/${id}.${fileExt}`, (err) => {
                    if (err) {
                        return res
                            .status(500)
                            .send({ err: "Internal server error - cannot save file" });
                    }
                    return res.status(200).send({ msg: "Successfully saved file" });
                });
            }
        });
    }
    catch (err) {
        return res.status(400).send({ err: "Bad request" });
    }
};
exports.uploadEventImage = uploadEventImage;
const createEvent = (req, res) => {
    // FIXME: integrate add event + upload event image
    //@ts-ignore
    const user = req.cookies.jwt;
    try {
        // user verification
        jwt.verify(user, process.env.JWT_TOKEN, (err, decodedToken) => __awaiter(void 0, void 0, void 0, function* () {
            if (err) {
                return (res
                    //@ts-ignore
                    .status(403)
                    .send({
                    err: "You don't have permissions to execute this action",
                }));
            }
            // console.log("verified");
            // getting data from request
            const { eventName, isPublic, premiumEvent, membersRestrictions, place, city, eventDescription, openChat, fileSrc, maxMembers, date } = JSON.parse(req.body.jsondataRequest);
            // console.log();
            // console.log(decodedToken.id);
            yield Chat.create(
            // creating chat for event
            { organizatorId: decodedToken.id, open: openChat }, (err, chat) => __awaiter(void 0, void 0, void 0, function* () {
                if (err) {
                    console.log(`Error while creating chat: ${err}`);
                    return res
                        .status(500)
                        .send({ err: "Internal server error - cannot create chat" });
                }
                yield Event.create(
                // creating event and linking chat to it
                {
                    name: eventName,
                    organizatorId: decodedToken.id,
                    public: isPublic,
                    premium: premiumEvent,
                    membersRestrictions,
                    place,
                    city,
                    description: eventDescription,
                    chatId: chat._id,
                    imageSrc: fileSrc,
                    maxMembers,
                    date
                }, (err, event) => __awaiter(void 0, void 0, void 0, function* () {
                    var _a;
                    if (err) {
                        console.log(`Error while creating event: ${err}`);
                        return res.status(500).send({
                            err: "Internal server error - cannot create event",
                        });
                    }
                    const userPreferences = yield UserPreferences.findOne({ userId: decodedToken.id }).select("chatSections");
                    const pushedChats = userPreferences.chatSections[0].chats;
                    pushedChats.push(chat._id.toString());
                    yield UserPreferences.updateOne({ _id: userPreferences._id, "chatSections.name": "my events chats" }, {
                        $set: {
                            "chatSections.$.chats": pushedChats
                        }
                    });
                    const userData = yield User.findById(decodedToken.id).select("promotionEvents premium");
                    console.log(userData);
                    if (userData && !userData.premium) {
                        userData.promotionEvents = userData.promotionEvents - 1;
                        yield userData.save();
                    }
                    const file = (_a = req.files) === null || _a === void 0 ? void 0 : _a.file;
                    if (file) {
                        // creating file
                        const fileExt = file.name.split(".").pop();
                        file.mv(`${__dirname}/../static/uploads/events/${event._id}.${fileExt}`, (err) => __awaiter(void 0, void 0, void 0, function* () {
                            if (err) {
                                return res.status(500).send({
                                    err: "Internal server error - cannot save file",
                                });
                            }
                            event.imageSrc = `${process.env.SERVER_IP}/get/event-image/${event._id}.${fileExt}`;
                            // event.imageSrc = `/static/uploads/events/${event._id}.${fileExt}`
                            yield event.save();
                            return res.status(200).send({
                                msg: "Successfully saved file, created event and chat",
                            });
                        }));
                    }
                    else {
                        return res.status(200).send({
                            msg: "Successfully created event and chat - image default",
                        });
                    }
                }));
            }));
        }));
    }
    catch (err) {
        console.log(`Cannot add event: ${err}`);
    }
};
exports.createEvent = createEvent;
const getEventImage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const urlParts = req.url.split("/");
    const eventId = urlParts[urlParts.length - 1];
    if (!eventId)
        return res.send({ err: "Event not specified" });
    res.sendFile(path.join(__dirname + "/../static/uploads/events/" + eventId));
});
exports.getEventImage = getEventImage;
const joinEvent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { jwt } = req.cookies;
    const user = yield (0, auth_1.verifyUser)(jwt);
    if (!user)
        return res.send({ err: "User not verified! " });
    const { eventId } = JSON.parse(req.body);
    const userAlreadyJoined = yield JoinRequest.findOne({ userId: user.id });
    if (userAlreadyJoined)
        return res.send({ err: "You have already joined this event" });
    try {
        yield JoinRequest.create({ userId: user.id, eventId });
    }
    catch (err) {
        return res.send({ err: "Internal server error " });
    }
    return res.send({ msg: "Successfully created join request" });
});
exports.joinEvent = joinEvent;
const getEventRequests = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { jwt } = req.cookies;
    const user = yield (0, auth_1.verifyUser)(jwt);
    if (!user)
        return res.send({ err: "Cannot verify user " });
    const { eventId } = JSON.parse(req.body);
    const requests = yield JoinRequest.find({ eventId, accepted: "pending" }).lean();
    for (let request of requests) {
        const userData = yield User.findOne({ _id: request.userId }).select("name date age sex");
        request.userData = userData;
    }
    // console.log(requests);
    return res.send(requests);
});
exports.getEventRequests = getEventRequests;
const acceptUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("leci");
    const { jwt } = req.cookies;
    const user = yield (0, auth_1.verifyUser)(jwt);
    if (!user)
        return res.send({ err: "User not verified" });
    const { requestId } = JSON.parse(req.body);
    try {
        const request = yield JoinRequest.findById(requestId);
        request.accepted = "yes";
        console.log(request);
        yield request.save();
        console.log(request);
        const userPreferences = yield UserPreferences.findOne({ userId: request.userId }).select("chatSections");
        const event = yield Event.findById(request.eventId).select("chatId members");
        const chat = yield Chat.findById(event.chatId).select("_id members");
        let otherChats = userPreferences.chatSections[1].chats;
        otherChats.push(chat._id.toString());
        yield UserPreferences.updateOne({ _id: userPreferences._id, "chatSections.name": "other" }, {
            $set: {
                "chatSections.$.chats": otherChats
            }
        });
        yield userPreferences.save();
        event.members.push(request.userId);
        yield event.save();
        console.log(chat);
        chat.members.push(request.userId);
        yield chat.save();
        return res.send({ msg: "Success" });
    }
    catch (err) {
        console.log(err);
    }
});
exports.acceptUser = acceptUser;
const rejectUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { jwt } = req.cookies;
    const user = yield (0, auth_1.verifyUser)(jwt);
    if (!user)
        return res.send({ err: "User not verified" });
    const { requestId } = JSON.parse(req.body);
    try {
        const request = yield JoinRequest.findById(requestId);
        request.accepted = "no";
        yield request.save();
        return res.send({ msg: "Success" });
    }
    catch (err) {
        console.log(err);
    }
});
exports.rejectUser = rejectUser;
