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
const Chat = require("../models/Chat");
const Event = require("../models/Event");
const Preferences = require("../models/UserPreferences");
const RoomManager_1 = __importDefault(require("./RoomManager"));
function getUserChatsData(chatsId, userId, socket) {
    return __awaiter(this, void 0, void 0, function* () {
        const returnObject = {};
        let allChatsId = [];
        let userChats = yield Preferences.findOne({ userId }).select("chatSections");
        if (!userChats)
            return {};
        userChats = userChats.chatSections;
        for (let section of userChats) {
            const sectionName = section.name;
            const sectionChatsId = section.chats;
            let sectionChats = [];
            if (!sectionChatsId)
                return [];
            for (let chatId of sectionChatsId) {
                let foundChat = yield Chat.findById(chatId);
                if (!foundChat)
                    return null;
                foundChat.messages = [foundChat.messages[foundChat.messages.length - 1]];
                allChatsId.push(foundChat._id.toString());
                const event = yield Event.findOne({ chatId: foundChat._id }).select("premium city place name imageSrc");
                foundChat = Object.assign(Object.assign({}, foundChat._doc), { event, _id: foundChat._id.toString() });
                sectionChats.push(foundChat);
            }
            // @ts-ignore
            returnObject[sectionName] = sectionChats;
            RoomManager_1.default.joinSocketToRoom(allChatsId, socket);
        }
        return returnObject;
    });
}
function getChatMessages(chatId, count) {
    return __awaiter(this, void 0, void 0, function* () {
        let messages = yield Chat.findById(chatId).select("messages");
        const messagesCount = +`-${count}`;
        messages = messages.messages.slice(messagesCount);
        return messages;
    });
}
function messageSent(chatId, message) {
    return __awaiter(this, void 0, void 0, function* () {
        const chatMessages = yield Chat.findById(chatId).select("messages");
        if (!chatMessages)
            return;
        chatMessages.messages.push(message);
        chatMessages.save().catch((err) => console.log(err)); // TODO: write error to database)
    });
}
function createNewChatSection(userId, sectionName) {
    return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
        try {
            const userPreferences = yield Preferences.findOne({ userId });
            if (!userPreferences)
                reject({ err: "Cannot find user" });
            const chatSectionExist = userPreferences.chatSections.some((chatSection) => chatSection.name == sectionName);
            if (chatSectionExist)
                return resolve({ err: "This section exist" }); // if user have already created this section
            userPreferences.chatSections.push({ name: sectionName, chats: [] });
            userPreferences.save().then((res) => {
                resolve({ msg: "Added new chat section" });
            }).catch((err) => {
                console.log(err);
                resolve({ err });
            }); // TODO write error to database
        }
        catch (err) {
            reject({ err });
        }
    }));
}
function moveChatToAnotherSection(userId, chatId, prevSection, newSection) {
    return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
        try {
            const preferences = yield Preferences.findOne({ userId });
            const chatSections = preferences.chatSections;
            const pSectionIndex = chatSections.findIndex((section) => section.name === prevSection);
            const nSectionIndex = chatSections.findIndex((section) => section.name === newSection);
            if (pSectionIndex == -1 || nSectionIndex == -1)
                return resolve({ err: "Bad section names" });
            const lastChatArr = chatSections[pSectionIndex].chats.filter((pchatId) => pchatId !== chatId);
            const isChatInNewSection = chatSections[nSectionIndex].chats.some((pChatId) => pChatId == chatId);
            chatSections[pSectionIndex].chats = lastChatArr;
            if (!isChatInNewSection)
                chatSections[nSectionIndex].chats.push(chatId);
            yield Preferences.updateOne({ userId }, { chatSections: chatSections });
            resolve({ msg: "Success" });
        }
        catch (err) {
            reject({ err });
        }
    }));
}
function removeChatSection(userId, chatSectionName) {
    return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
        try {
            const preferences = yield Preferences.findOne({ userId });
            if (!preferences)
                return resolve({ err: "Cannot find user chat sections" });
            const newChatSections = preferences.chatSections.filter((chatSection) => chatSection.name !== chatSectionName);
            yield Preferences.updateOne({ userId }, { chatSections: newChatSections });
            resolve({ msg: "Success" });
        }
        catch (err) {
            reject({ err });
        }
    }));
}
function actualizeUserData(sections, userId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (sections.length === 0)
                return;
            yield Preferences.updateOne({ userId }, { chatSections: sections });
        }
        catch (err) { //TODO : error handling
            console.log(err);
        }
    });
}
const resolver = {
    getUserChatsData,
    getChatMessages,
    messageSent,
    createNewChatSection,
    moveChatToAnotherSection,
    removeChatSection,
    actualizeUserData
};
exports.default = resolver;
