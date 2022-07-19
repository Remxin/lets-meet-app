const Chat = require("../models/Chat")
const Event = require("../models/Event")
const Preferences = require("../models/UserPreferences")
import RoomManager from './RoomManager'



type MessageType = {
    text: string,
    userId: string,
    userName: String,
    timestamps: number
}

async function getUserChatsData (chatsId: String[], userId: String, socket: any) { // gives minimum informations about chats
    
    // ! hallelujah it works - DO NOT TOUCH THIS
    const returnObject = {}
    let userChats = await Preferences.findOne({ userId }).select("chatSections")
    userChats = userChats.chatSections
    if (!userChats) return {}
    const keys = Object.keys(userChats)
    const values = Object.values(userChats)
    let incrementer = 0
    
    for (let key of keys) {
        let allChatsId: string[] = []
        //@ts-ignore
        const chatInfo = values[incrementer].map(async (chatId) => {
            let chat = await Chat.findById(chatId)
            if (!chat) return null
            allChatsId.push(chat._id.toString())
            // allChatsId = [...allChatsId, chat._id]
            console.log(chat._id.toString())
            const event = await Event.findById(chat.eventId).select("premium city place name")
            //@ts-ignore
            chat = {...chat._doc, event, _id: chat._id.toString()}
            return chat
        })
        //@ts-ignore
        returnObject[key] = await Promise.all(chatInfo)
        
        RoomManager.joinSocketToRoom(allChatsId, socket)
        incrementer++
    }
  
    
    return returnObject
}

async function getChatMessages (chatId: String, count: Number) {
    let messages = await Chat.findById(chatId).select("messages")
    const messagesCount = +`-${count}`
    messages = messages.messages.slice(messagesCount)
    return messages
}

async function messageSent(chatId: String, message: MessageType) {
    const chatMessages = await Chat.findById(chatId).select("messages")
    chatMessages.messages.push(message)
    chatMessages.save().catch((err: Error) => console.log(err)) // TODO: write error to database)
}

function createNewChatSection(userId: String, sectionName: string) {
    return new Promise(async (resolve, reject) => {
        const userPreferences = await Preferences.findOne({ userId })
        
        if (userPreferences.chatSections[sectionName]) resolve({err: "This section exist"})
        // console.log(userPreferences.chatSections)
        // console.log(sectionName)
        const sections = userPreferences.chatSections
        sections[sectionName] = []
        
        const id = userPreferences._id
        console.log(sections)
        await Preferences.findOneAndDelete(id)
        await  Preferences.create(sections)
        // userPreferences.chatSections = sections
        // console.log(sections)
        // console.log(userPreferences)
        
        userPreferences.save().then((res: any) => {
            console.log(res)
            resolve({msg: "Added new chat section"})
        }).catch((err: Error) => {
            console.log(err)
            resolve({ err })
        }) // TODO write error to database
    })
}

const resolver = {
    getUserChatsData,
    getChatMessages,
    messageSent,
    createNewChatSection
}
export default resolver