const Chat = require("../models/Chat")
const Event = require("../models/Event")
const Preferences = require("../models/UserPreferences")
import RoomManager from './RoomManager'
import {chatType} from '../types/modelTypes'




type MessageType = {
    text: string,
    userId: string,
    userName: String,
    timestamps: number
}

type SectionType = {
    name: String,
    chats: chatType[]
}

async function getUserChatsData (chatsId: String[], userId: String, socket: any) { // gives minimum informations about chats
    
    const returnObject = {}
    let allChatsId = []

    let userChats = await Preferences.findOne({ userId }).select("chatSections")
    if (!userChats) return {}
    userChats = userChats.chatSections
    for (let section of userChats) {
        const sectionName = section.name
        const sectionChatsId:String[] = section.chats
        let sectionChats = []

        for (let chatId of sectionChatsId) {
            let foundChat = await Chat.findById(chatId)
            if (!foundChat) return null
            foundChat.messages = [foundChat.messages[foundChat.messages.length - 2]]
            allChatsId.push(foundChat._id.toString())
            const event = await Event.findOne({chatId: foundChat._id}).select("premium city place name")
  
            foundChat = {...foundChat._doc, event, _id: foundChat._id.toString()}
            sectionChats.push(foundChat)
        }
        // @ts-ignore
        returnObject[sectionName] = sectionChats
        RoomManager.joinSocketToRoom(allChatsId, socket)
    }

  
  
    
    return returnObject
}

async function getChatMessages (chatId: String, count: Number) {
    let messages = await Chat.findById(chatId).select("messages")
    // console.log(messages)
    const messagesCount = +`-${count}`
    messages = messages.messages.slice(messagesCount)
    return messages
}

async function messageSent(chatId: String, message: MessageType) {
    console.log(chatId)
    const chatMessages = await Chat.findById(chatId).select("messages")
    // console.log(chatMessages)
    if (!chatMessages) return
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