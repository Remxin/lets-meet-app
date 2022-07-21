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
        try {
            const userPreferences = await Preferences.findOne({ userId })
            if (!userPreferences) reject({err: "Cannot find user"})
            const chatSectionExist = userPreferences.chatSections.some((chatSection: any) => chatSection.name == sectionName)
            if (chatSectionExist) return resolve({err: "This section exist"}) // if user have already created this section
    
            userPreferences.chatSections.push({name: sectionName, chats: []})
          
            
            userPreferences.save().then((res: any) => {
                resolve({msg: "Added new chat section"})
            }).catch((err: Error) => {
                console.log(err)
                resolve({ err })
            }) // TODO write error to database

        } catch (err) {
            reject({ err })
        }
    })
}

function moveChatToAnotherSection (userId: String, chatId: String, prevSection: String, newSection: String) {
    return new Promise(async (resolve, reject) => {
        try {
            const preferences = await Preferences.findOne({userId})
            const chatSections = preferences.chatSections
            
            console.log(prevSection)

            const pSectionIndex = chatSections.findIndex((section: SectionType) => section.name === prevSection)
            const nSectionIndex = chatSections.findIndex((section: SectionType) => section.name === newSection)
            
            if (pSectionIndex == -1 || nSectionIndex == -1) return resolve({err: "Bad section names"})
            const lastChatArr = chatSections[pSectionIndex].chats.filter((pchatId: String) => pchatId !== chatId)
        
 
            chatSections[pSectionIndex].chats = lastChatArr
            chatSections[nSectionIndex].chats.push(chatId)
  
            await Preferences.updateOne({ userId }, {chatSections: chatSections})
        
        
        } catch (err) {
            reject({ err })
        }
    })
}

const resolver = {
    getUserChatsData,
    getChatMessages,
    messageSent,
    createNewChatSection,
    moveChatToAnotherSection
}
export default resolver