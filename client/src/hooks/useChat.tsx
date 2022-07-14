//@ts-nocheck
import React, { useReducer, useEffect, useState } from 'react'
import io from 'socket.io-client';

const SOCKETIP = process.env.REACT_APP_SOCKET_IP || ""
const socket = io(SOCKETIP)


export enum CASES {
    GETMAINCHATMESSAGES = "getMainChatMessages",
    CHANGEMAINCHAT = "changeMainChat",
    WRITEMESSAGE = "writeMessage",
    GETLASTMAINCHATMESSAGE = "getLastMainChatMessage",
    GETUSERCHATS = "getUserChats",
    GETLASTMESSAGEOFCHAT = "getLastMessageOfChat",
    SETLASTMESSAGEOFCHAT = "setLastMessageOfChat",
    DISCONNECTSOCKET = "disconnectSocket"
}

const socketIncomingActions = ["user-chats"]

function reducer(state: any, action: any) {
    switch(action.type) {
        case CASES.GETMAINCHATMESSAGES:
            state.mainChat.messages = action.payload.messages 
            break
        case CASES.CHANGEMAINCHAT:
            // removing main chat (and setting required props for side chats)
            state.mainChat.lastMessage = {...state.mainChat.messages[state.mainChat.messages.length - 1], seen: true}
            if (state.mainChat.id) state.allChats.push(state.mainChat)

            // setting new chat as main
            state.mainChat = state.allChats.find((chat) => chat.id === action.payload.newMainChatId)
            break
        case CASES.WRITEMESSAGE:
            state.mainChat.messages.push(action.payload.newMessage)
            break
        case CASES.GETUSERCHATS:
            // connect to each room + get rooms data
            socket.emit("request-chats-data", {chatsId: action.payload.chats}, (response) => {  // * this (get here last message)
                response.forEach((chatData) => {
                    // * or this (get chat's last message info)
                    // socket.emit("request-chat-last-message", {chatId: chatData.id}, ((lastMessage) => {
                    //     // only sender needs to get feedback
                    //     chatData.messages.push(lastMessage)
                    // })) 
                    state.allChats.push(chatData)
                })
            }) 
            // --- all last messages added (may work) in other case return Promise after case ---
            state.payload.loadingBoolFunction(false)
            break
        case CASES.GETLASTMESSAGEOFCHAT: // ! rather delete
            // const chatData = state.playload.chatData
            // socket.emit("request-chat-last-message", {chatData}, ((response) => {
            //     // only sender needs to get feedback
            // })) 
            // state.allChats.push(chatData)
            break
        case CASES.SETLASTMESSAGEOFCHAT: 
            break
        case CASES.DISCONNECTSOCKET:
            socketIncomingActions.forEach((action) => {
                socket.off(action)
            })
            break

        default:
            throw new Error("This method do not exist")
        
    }
}

export const useChat = () => {
    const [isSocketConnecting, setIsSocketConnecting] = useState(true)
    const [areChatsLoading, setAreChatsLoading] = useState(false)
    const [mainChatId, setMainChatId] = useState(null)
   
    const [state, dispatch] = useReducer(reducer, {
        mainChat: {
            id: null,
            owner: null,
            messages: [
                // {id, timestamps, userId, text} (max: 30)
            ]
        },
        allChats: [
            /* 
            {
            id: String, owner: UserType,
            messages: [
                {id, timestamps, userId, text} (max: 15)
            ],
            lastMessage: {id, timestamps, userId, text, seen: boolean} (only 1)
            } */
        ]
    })

    useEffect(() => {
        // check if socket is promise?
        if (socket) setIsSocketConnecting(false)

        setAreChatsLoading(true)
        socket.emit("request-user-chats", {userId: ""})
        socket.on('user-chats', async (chatsArr) => {
            dispatch({type: CASES.GETUSERCHATS, payload: {chats: chatsArr, loadingBoolFunction: setAreChatsLoading}})
        })
        socket.on("last-message", (messageData) => dispatch({type: CASES.GETLASTMESSAGEOFCHAT}))

        return () => {
            // clearing data and disconnecting socket (socket.off(every_emit)) and disconnect from everyRoom (chatId)
            dispatch({type: CASES.DISCONNECTSOCKET})
        }
    }, [socket])

    useEffect(() => {
        if (!socket) return
        dispatch({type: CASES.CHANGEMAINCHAT, payload: {newMainChatId: mainChatId}})
        socket.emit("last-messages", { chatId: mainChatId }, (response) => dispatch({type: CASES.GETMAINCHATMESSAGES, payload: {messages: response}}))

    }, [mainChatId])

    return { isSocketConnecting, areChatsLoading, mainChat: state.mainChat, allChat: state.allChat, setMainChatId}
}

