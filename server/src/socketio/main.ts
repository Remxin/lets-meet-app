import { createServer } from "http";
import { Server } from "socket.io";
import { serialize, parse } from "cookie";
// import { verifyUser } from "../helpers/auth"
import { verifySocketUser } from "./auth";
import resolver from "./resolvers";
import { callbackify } from "util";
import { Socket } from "dgram";
import RoomManager from './RoomManager'
import { resolveReadonlyArrayThunk } from "graphql";

const SOCKETPORT = process.env.SOCKET_PORT || 5003
const httpServer = createServer();

const io = new Server(httpServer, {
  // options
  cors: {
    origin: true,
    methods: ["GET", "POST"],
    credentials: true
  },
  cookie: true,
  pingTimeout: 30000,
  allowRequest: async (req, callback) => verifySocketUser(req, callback) // hanshake function for allowing user access

});

//@ts-ignore
io.on("connection", (socket: Socket) => { // on connection
    console.log(`User connected to socket port: ${SOCKETPORT}`)
    //@ts-ignore
    RoomManager.setIo(io)

    socket.on("request-user-chats-data", async (params, callback) => {
        const result = await resolver.getUserChatsData(params.chats, params.userId, socket)
        callback({
            chats: result
        })
    })

    socket.on("request-chat-messages", async (params, callback) => {
      const {chatId, count} = params
      const result = await resolver.getChatMessages(chatId, count)
      callback({
        messages: result
      })
    })

    socket.on("message-sent", (params) => {
      const { chatId, message } = params
      resolver.messageSent(chatId, message)
      io.to(chatId).emit("get-message", {message, chatId})
    })

    socket.on("request-create-new-chat-section", async (params, callback) => {
      const { userId, sectionName } = params
      const res = await resolver.createNewChatSection(userId, sectionName)
      callback(res)
    })

    socket.on("request-move-chat-to-another-section", async (params, callback) => {
      const {userId, chatId, prevSection, newSection } = params
      const res = await resolver.moveChatToAnotherSection(userId, chatId, prevSection, newSection)
      callback(res)
    })

    socket.on("request-remove-chat-section", async (params, callback) => {
      const {userId, sectionName} = params
      const res = await resolver.removeChatSection(userId, sectionName)
      callback(res)
    })
});

io.on("connect-error", () => { // connecting to socket error

})


httpServer.listen(SOCKETPORT)
console.log(`🔌 Socket listening on port ${SOCKETPORT}`)