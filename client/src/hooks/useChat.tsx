//@ts-nocheck
import React, { useReducer, useEffect, useState, useContext, useRef, useCallback } from 'react'
import { UserContext } from '../contexts/UserContext';
import io from 'socket.io-client';

const SOCKETIP = process.env.REACT_APP_SOCKET_IP || ""
const socket = io(SOCKETIP, { withCredentials: true})


enum CASES {
    GETUSERCHATS = "getUserChats",
    SETMAINCHAT = "setMainChat",
    GETMESSAGE = "getMessage",
    CREATECHATSECTION = "createChatSection",
    DISCONNECTSOCKET = "disconnectSocket"
}

const socketIncomingActions = ["get-message"]

function reducer(state: any, action: any) {
    let chatSections = null
    let chosenChat = null
    switch(action.type) {
        case CASES.GETUSERCHATS: // is working
            // connect to each room + get rooms data
            return {
                ...state,
                allChats: action.payload.chats
            }

        case CASES.SETMAINCHAT: // is working
            chatSections = Object.keys(state.allChats)
            chosenChat = null

            for (let section of chatSections) {
                for (let chat of state.allChats[section]) {
                    if (chat._id == action.payload.mainChatId) {
                        chosenChat = chat
                        chosenChat.messages = action.payload.messages
                        if (chosenChat?.messages[chosenChat.messages.length - 1]?.seen) chosenChat.messages[chosenChat.messages.length - 1].seen = true // last message has been seen now
                    }
                }
            }
            return {
                ...state,
                mainChat: chosenChat
            }
        case CASES.GETMESSAGE:
            chatSections = Object.keys(state.allChats)
            chosenChat = null
            console.log("get message")

            for (let section of chatSections) {
                for (let chat of state.allChats[section]) {
                    if (chat._id == action.payload.chatId) {
                        chosenChat = chat
                        chosenChat.messages = []
                        // if this isn't your main chat set the message to not read
                        const newMessage = {...action.payload.message, seen: chat._id == state.mainChat?._id}
                        chosenChat.messages.push(newMessage)
                    }
                }
            }
            return { ...state }
        
        case CASES.CREATECHATSECTION:
            const newSection = action.payload.sectionName
            if (state.allChats?.[newSection]) return 
            state.allChats[newSection] = []
            return { ...state }
            

        case CASES.DISCONNECTSOCKET:
            for (let action of socketIncomingActions) {
                socket.off(action)
            }
        return {...state}

        default:
            throw new Error("This method do not exist")
        
    }
}

function sendMessageTemplate(userName: String, userId: String, message: String, chatId: String) {
    const messageObject = {user: userName, userId: userId, message, timestamps: Date.now()}
    socket.emit("message-sent", {chatId, message: messageObject})
}

export const useChat = () => {
    const errorTimeout = useRef(null)

    const { user } = useContext(UserContext)
    const userRef = useRef(user)
 

    const [isSocketConnecting, setIsSocketConnecting] = useState(true)
    const [areChatsLoading, setAreChatsLoading] = useState(false)
    const [mainChatId, setMainChatId] = useState<String | null>(null)
    const [isConnectionError, setIsConnectionError] = useState(false)
    const [errorText, setErrorText] = useState("")
   
    const [chats, dispatch] = useReducer(reducer, {
        mainChat: null,
        // {
        //     _id: null,
        //     owner: null,
        //     userCanWrite: null,
        //     messages: [
                // {id, timestamps, userId, text} (max: 30)
        //     ]
        // },
        allChats: [
            // 'chatSection': [] 
            /*                  |
            {                   V
            _id: String, owner: UserType,
            userCanWrite: boolean,
            messages: [
                {_id, timestamps, userId, text} (max: 15)
            ],
            lastMessage: {_id, timestamps, userId, text, seen: boolean} (only 1)
            } */
        ]
    })
    // console.log(user)
    const sendMessage = useCallback((message: String) => {
        sendMessageTemplate(userRef.current.name, userRef.current._id, message, chats.mainChat?._id) // works
    }, [chats?.mainChat])

    const createNewChatSection = useCallback((sectionName: String) => {
        console.log('create')
        socket.emit("request-create-new-chat-section", {userId: userRef.current._id, sectionName}, (result) => {
            if (result.err) return setErrorText("Error in creating new chat section")
            dispatch({type: CASES.CREATECHATSECTION, payload: { sectionName }})
        })
    }, [])

    // prevent userContext error
    useEffect(() => {
        userRef.current = user
    }, [user])
    // ----- setting error timeout -----
    useEffect(() => {
        errorTimeout.current = setTimeout(() => { // after 10s returns error
            setIsConnectionError(true) 
        }, 10000)
    }, [])


    // _-_-_-_- MAIN USEEFFECT _-_-_-_-_-
    useEffect(() => {
        if (!socket.connected || !user) return 

        clearTimeout(errorTimeout.current)
        setIsSocketConnecting(false)
        setAreChatsLoading(true)

        // emit for chats data
        socket.emit("request-user-chats-data", {chats: user.chatsId, userId: user._id}, (response) => {
            dispatch({type: CASES.GETUSERCHATS, payload: {chats: response.chats}})
            setAreChatsLoading(false)
        })
      
        // get chat message (when someone sends)
        socket.on("get-message", (data) => dispatch({type: CASES.GETMESSAGE, payload: {message: data.message, chatId: data.chatId}}))

        return () => {
            // clearing data and disconnecting socket (socket.off(every_emit)) and disconnect from everyRoom (chatId)
            dispatch({type: CASES.DISCONNECTSOCKET})
        }
    }, [socket, socket?.connected])

    // ----- setting chosen chat to main (by id) ------
    useEffect(() => { 
        if (!mainChatId) return
        socket.emit("request-chat-messages", { chatId: mainChatId, count: 20 }, (response) => dispatch({type: CASES.SETMAINCHAT, payload: {messages: response.messages, mainChatId}}))
        
    }, [mainChatId])

    const chatManager = {
        mainChat: chats?.mainChat,
        allChats: chats?.allChats,
        setMainChatId,
        sendMessage
    }
    const sectionManager = {
        aa: "bb",
        createNewChatSection
    }
    console.log(chats)
    return { isSocketConnecting, areChatsLoading, isConnectionError, chatManager, sectionManager}
}

