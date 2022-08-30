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
const http_1 = require("http");
const socket_io_1 = require("socket.io");
// import { verifyUser } from "../helpers/auth"
const auth_1 = require("./auth");
const resolvers_1 = __importDefault(require("./resolvers"));
const RoomManager_1 = __importDefault(require("./RoomManager"));
const SOCKETPORT = process.env.SOCKET_PORT || 5003;
const httpServer = (0, http_1.createServer)();
const io = new socket_io_1.Server(httpServer, {
    // options
    cors: {
        origin: true,
        methods: ["GET", "POST"],
        credentials: true
    },
    cookie: true,
    pingTimeout: 30000,
    allowRequest: (req, callback) => __awaiter(void 0, void 0, void 0, function* () { return (0, auth_1.verifySocketUser)(req, callback); }) // hanshake function for allowing user access
});
//@ts-ignore
io.on("connection", (socket) => {
    console.log(`User connected to socket port: ${SOCKETPORT}`);
    //@ts-ignore
    RoomManager_1.default.setIo(io);
    socket.on("request-user-chats-data", (params, callback) => __awaiter(void 0, void 0, void 0, function* () {
        console.log("pyta");
        const result = yield resolvers_1.default.getUserChatsData(params.chats, params.userId, socket);
        console.log(result);
        callback({
            chats: result
        });
    }));
    socket.on("request-chat-messages", (params, callback) => __awaiter(void 0, void 0, void 0, function* () {
        const { chatId, count } = params;
        const result = yield resolvers_1.default.getChatMessages(chatId, count);
        callback({
            messages: result
        });
    }));
    socket.on("message-sent", (params) => {
        const { chatId, message } = params;
        resolvers_1.default.messageSent(chatId, message);
        io.to(chatId).emit("get-message", { message, chatId });
    });
    socket.on("request-create-new-chat-section", (params, callback) => __awaiter(void 0, void 0, void 0, function* () {
        const { userId, sectionName } = params;
        const res = yield resolvers_1.default.createNewChatSection(userId, sectionName);
        callback(res);
    }));
    socket.on("request-move-chat-to-another-section", (params, callback) => __awaiter(void 0, void 0, void 0, function* () {
        const { userId, chatId, prevSection, newSection } = params;
        const res = yield resolvers_1.default.moveChatToAnotherSection(userId, chatId, prevSection, newSection);
        callback(res);
    }));
    socket.on("request-remove-chat-section", (params, callback) => __awaiter(void 0, void 0, void 0, function* () {
        const { userId, sectionName } = params;
        const res = yield resolvers_1.default.removeChatSection(userId, sectionName);
        callback(res);
    }));
    socket.on("request-actualize-user-chat-preferences", (params) => {
        const { sections, userId } = params;
        resolvers_1.default.actualizeUserData(sections, userId);
    });
});
io.on("connect-error", () => {
});
httpServer.listen(SOCKETPORT);
console.log(`🔌 Socket listening on port ${SOCKETPORT}`);
