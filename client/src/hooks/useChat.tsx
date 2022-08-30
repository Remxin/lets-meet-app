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
    POSITIONCHAT = 'positionChat',
    CREATECHATSECTION = "createChatSection",
    MOVECHATTOANOTHERSECTION = "moveChatToAnotherSection",
    REMOVECHATSECTION = "removeChatSection",
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
    

            for (let section of chatSections) {
                for (let chat of state.allChats[section]) {
                    if (chat._id == action.payload.chatId) {
                        
                        chosenChat = chat
                        if (chosenChat._id === state.mainChat._id) { // this is main chat do not delete prev chat data
                            chosenChat.messages.push({...action.payload.message, seen: true})

                        } else {    // this is side chat (want to store only last message)
                            chosenChat.messages = []
                            const newMessage = {...action.payload.message, seen: false}
                            chosenChat.messages.push(newMessage)

                            
                            // if this isn't your main chat set the message to not read
                        }
                    }
                }
            }
            return { ...state }
        case CASES.POSITIONCHAT:
            let { chatId, newChatIndex, sectionName } = action.payload
            const sectionChats = state.allChats[sectionName]

            const fromIndex = sectionChats.findIndex((chat) => chat._id === chatId); // 👉️ 0

            const element = sectionChats.splice(fromIndex, 1)[0];

            sectionChats.splice(newChatIndex, 0, element);

            state.allChats[sectionName] = sectionChats

            return { ...state }
        case CASES.CREATECHATSECTION:
            const newSection = action.payload.sectionName
            if (state.allChats?.[newSection]) return 
            state.allChats[newSection] = []
            return { ...state }
        
        case CASES.REMOVECHATSECTION:
            delete state.allChats[action.payload.sectionName]
            return { ...state }
            
        case CASES.MOVECHATTOANOTHERSECTION:
            console.log(state);
            state.allChats[action.payload.prevSection].filter((chat: string) => chat !== action.payload.chatId)
            state.allChats[action.payload.newSection].push(action.payload.chatId)

            return {...state}


        case CASES.DISCONNECTSOCKET: // main purpose of this function is to disconnect from socket + save user chats in right order inside sections
            const sectionsArr = []
            for (let chatSection in state.allChats) {
                const chatsId = state.allChats[chatSection].map((chatData) => chatData._id)
                sectionsArr.push({name: chatSection, chats: chatsId})
            }
            socket.emit("request-actualize-user-chat-preferences", {sections: sectionsArr, userId: action.payload.userId})
            for (let actionName of socketIncomingActions) {
                socket.off(actionName)
            }
            socket.close()
        return {...state}

      
            

        default:
            console.log(action);
            
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
    const [socketEstabilished, setSockeEstabilished] = useState(false)
    const [forceReload, setForceReload] = useState(false)
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
    const sendMessage = useCallback((message: String) => {
        if (!userRef.current || !chats.mainChat) return setErrorText("Application error")
        sendMessageTemplate(userRef.current.name, userRef.current._id, message, chats.mainChat?._id) // works
    }, [chats?.mainChat, mainChatId])

    const positionChat = useCallback((chatId: String, newChatIndex: number, sectionName: String) => { // when you drag chat to another position (like in todo list)
        dispatch({type: CASES.POSITIONCHAT, payload: {chatId, newChatIndex, sectionName}})
    }, [])

    const createNewChatSection = useCallback((sectionName: String) => {
        socket.emit("request-create-new-chat-section", {userId: userRef.current._id, sectionName}, (result) => {
            if (result.err) return setErrorText("Error in creating new chat section")
            dispatch({type: CASES.CREATECHATSECTION, payload: { sectionName }})
        })
    }, [])

    const moveChatToAnotherSection = useCallback((chatId: String, prevSection: String, newSection: String) => {
        socket.emit("request-move-chat-to-another-section", {userId: userRef.current._id, chatId, prevSection, newSection }, (result) => {
            if (result.err) return setErrorText("Error in moving chat to another section")
            dispatch({type: CASES.MOVECHATTOANOTHERSECTION, payload: {chatId, prevSection, newSection}})
            window.location.reload()
        })
    }, [])

    const removeChatSection = useCallback((sectionName: String) => {
        socket.emit("request-remove-chat-section", {userId: userRef.current._id, sectionName}, (result) => {
            if (result.err) return setErrorText("Cannot delete chat section")
            dispatch({type: CASES.REMOVECHATSECTION, payload: {sectionName}})
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

    // console.log(socket.connected);
    
    // _-_-_-_- MAIN USEEFFECT _-_-_-_-_-
    useEffect(() => {
        if (socketEstabilished) return
        if (!socket.connected || !user) return setTimeout(() => {
            // setForceReload(prev => !prev)
            window.location.reload()
        }, 500)

        clearTimeout(errorTimeout.current)
        setIsSocketConnecting(false)
        setAreChatsLoading(true)
        errorTimeout.current = setTimeout(() => {
            window.location.reload()
        }, 1000)

        // emit for chats data
        socket.emit("request-user-chats-data", {chats: user.chatsId, userId: user._id}, (response) => {
            // console.log("robi się");
            
            dispatch({type: CASES.GETUSERCHATS, payload: {chats: response.chats}})
            clearTimeout(errorTimeout.current)
            setAreChatsLoading(false)
        })
        
        // get chat message (when someone sends)
        socket.on("get-message", (data) => dispatch({type: CASES.GETMESSAGE, payload: {message: data.message, chatId: data.chatId}}))
        
        setSockeEstabilished(true)
        return () => {
            // clearing data and disconnecting socket (socket.off(every_emit)) and disconnect from everyRoom (chatId)
            dispatch({type: CASES.DISCONNECTSOCKET, payload: {userId: userRef.current._id}})
        }
    }, [socket, socket.connected, user, forceReload])

    // ----- setting chosen chat to main (by id) ------
    useEffect(() => { 
    
        if (!mainChatId) return
        socket.emit("request-chat-messages", { chatId: mainChatId, count: 20 }, (response) => dispatch({type: CASES.SETMAINCHAT, payload: {messages: response.messages, mainChatId}}))
        
    }, [mainChatId])

    const chatManager = {
        mainChatId,
        mainChat: chats?.mainChat,
        allChats: chats?.allChats,
        setMainChatId,
        sendMessage,
        positionChat
    }
    const sectionManager = {
        createNewChatSection,
        moveChatToAnotherSection,
        removeChatSection
    }

    return { isSocketConnecting, areChatsLoading, isConnectionError, chatManager, sectionManager}
}

