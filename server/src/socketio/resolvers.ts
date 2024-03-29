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
        if (!sectionChatsId) return []
        for (let chatId of sectionChatsId) {
            let foundChat = await Chat.findById(chatId)
            if (!foundChat) return null
            foundChat.messages = [foundChat.messages[foundChat.messages.length - 1]]
            allChatsId.push(foundChat._id.toString())
            const event = await Event.findOne({chatId: foundChat._id}).select("premium city place name imageSrc")
  
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
    const messagesCount = +`-${count}`
    messages = messages.messages.slice(messagesCount)
    return messages
}

async function messageSent(chatId: String, message: MessageType) {
    const chatMessages = await Chat.findById(chatId).select("messages")
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

            const pSectionIndex = chatSections.findIndex((section: SectionType) => section.name === prevSection)
            const nSectionIndex = chatSections.findIndex((section: SectionType) => section.name === newSection)
            
            if (pSectionIndex == -1 || nSectionIndex == -1) return resolve({err: "Bad section names"})
            const lastChatArr = chatSections[pSectionIndex].chats.filter((pchatId: String) => pchatId !== chatId)
        
            const isChatInNewSection = chatSections[nSectionIndex].chats.some((pChatId: String) => pChatId == chatId)

            chatSections[pSectionIndex].chats = lastChatArr
            
            if (!isChatInNewSection) chatSections[nSectionIndex].chats.push(chatId) 
  
            await Preferences.updateOne({ userId }, {chatSections: chatSections})
            resolve({msg: "Success"})
        
        
        } catch (err) {
            reject({ err })
        }
    })
}

function removeChatSection (userId: String, chatSectionName: String) {
    return new Promise(async (resolve, reject) => {
        try {  
            const preferences = await Preferences.findOne({ userId })
         
            if (!preferences) return resolve({err: "Cannot find user chat sections"})
            const newChatSections = preferences.chatSections.filter((chatSection: SectionType) => chatSection.name !== chatSectionName)
            await Preferences.updateOne({userId}, {chatSections: newChatSections})
            resolve({msg: "Success"})
        } catch (err) {
            reject({ err })
        }
    })
}

async function actualizeUserData (sections: any, userId: String) {
    try {
        if (sections.length === 0) return
        await Preferences.updateOne({userId}, {chatSections: sections})
    } catch (err) { //TODO : error handling
        console.log(err)
    }
            
}

const resolver = {
    getUserChatsData,
    getChatMessages,
    messageSent,
    createNewChatSection,
    moveChatToAnotherSection,
    removeChatSection,
    actualizeUserData
}
export default resolver