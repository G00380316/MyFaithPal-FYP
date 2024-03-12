"use client"

import { createContext, useState, useEffect, useCallback } from "react";
import { aiUrl, getRequest, postRequest } from "@/util/service";
import { useSession } from "next-auth/react";
import { io } from "socket.io-client";
import  dotenv  from "dotenv";

export const AIChatContext = createContext();
dotenv.config();

export const AIChatContextProvider = ({ children }) => {
    
    const { data: session } = useSession();
    const [aiUserChats, setaiUserChats] = useState(null);
    const [isaiUserChatsLoading, setIsaiUserChatsLoading] = useState(false);
    const [aiUserChatsError, setaiUserChatsError] = useState(null);
    const [currentAIChat, setCurrentAIChat] = useState(null);
    const [messages, setMessages] = useState(null);
    const [isMessagesLoading, setIsMessagesLoading] = useState(false);
    const [messagesError, setMessagesError] = useState(null);
    const [sendTextMessageError, setSendTextMessageError] = useState(null);
    const [newMessage, setNewMessage] = useState(null);
    const [socket, setSocket] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);

    console.log("Online Users:", onlineUsers);

    useEffect(() => {
        const newSocket = io(`http://localhost:8001`);
        setSocket(newSocket);

        return () => {
            newSocket.disconnect();
        };
    }, [session]);

    // add online users
    useEffect(() => {
        if (socket === null) return;
        socket.emit("addNewUser", session?.user?._id);
        socket.on("getOnlineUsers", (res) => {
            setOnlineUsers(res);
        });

        return () => {
            socket.off("getOnlineUsers");
        };
    }, [socket]);

    // send message
    useEffect(() => {
    if (socket === null) return;

        const recipientId = currentAIChat.participants
            .flat()
            .filter(id => id !== session?.user?._id);

        socket.emit("sendMessage", { ...newMessage, recipientId });

    }, [newMessage]);
    
    
    useEffect(() => {
        if (socket === null) return;
        
        console.log("I need", currentAIChat)
        
        const recipientId = currentAIChat.participants // Extract participants array from each chat
        .flat() // Flatten the array of arrays
            .filter(id => id !== process.env.AI_ID);
        
        console.log("I need 2", recipientId)
        
        socket.emit("sendMessage", { ...newMessage, recipientId });
    }, [newMessage]);

    //receive message
    useEffect(() => {
        if (socket === null) return;
        
        socket.on("getMessage", ( res ) => {
            
            if (currentAIChat?._id !== res.aichatroom) return
            
            setMessages((prev) => [...prev, res]);
        });

        return () => {
            socket.off("getMessage")
        }

    }, [newMessage,socket,currentAIChat]);
        
        
    useEffect(() => {
        const getaiUserChats = async () => {
            if (session?.user?._id) {
                setIsaiUserChatsLoading(true);
                setaiUserChatsError(null);

                const response = await getRequest(`${aiUrl}aichatroom/findall/${session?.user?._id}`);

                setIsaiUserChatsLoading(false);

                if (response.error) {
                    return setaiUserChatsError(response);
                }

                console.log(response);
                
                setaiUserChats(response);
            }
        };

        getaiUserChats();
    }, [session]);

    const createChat = useCallback(async (userId) => {
        const response = await postRequest(`${aiUrl}aichatroom/create`,
            JSON.stringify({
                userId
            })
        );

        if (response.error) {
            return console.log("Error creating chat", response);
        }

        setaiUserChats((prev) => [...prev, response]);
    }, []);

    useEffect(() => {
        const startAIUserChats = async () => {
            if (session?.user?._id) {
                const response = await getRequest(`${aiUrl}aichatroom/find/${session?.user?._id}`);
                
                console.log("Ai chat: ", response);

                if (response != null) {
                    setCurrentAIChat(response);
                } else {
                    createChat(session?.user?._id);
                    window.location.reload();
                }
            }
        };

        startAIUserChats();
        }, [session, createChat ,aiUrl]);
    
    useEffect(() => {
        const getMessages = async () => {

            setIsMessagesLoading(true);
            setMessagesError(null);

            const message = await getRequest(`${aiUrl}prompt/get/${currentAIChat?._id}`);

            console.log("current chat id", currentAIChat)

            setIsMessagesLoading(false);

            if (message.error) {
                return setMessagesError(message);
            }

            console.log(message);
                
            setMessages(message);
        };

        getMessages();
    }, [currentAIChat]);

    const sendTextMessage = useCallback( async (textMessage, currentAIChatID, setTextMessage) => {
        if (!textMessage) return console.log("No input");

        console.log("Sending AIChatroom ID to send message", currentAIChatID)
        console.log("Sending User ID to send message", session?.user?._id)
        console.log("Sending text message to send message", textMessage)

        const response = await postRequest(`${aiUrl}prompt/create`, JSON.stringify({
            aichatroom: currentAIChatID, user: session?.user?._id, text: textMessage,
        }));

        if (response.error) {
            setSendTextMessageError(response);
            return sendTextMessageError;
        }

        setNewMessage(response);
        setMessages((prev) => [...prev, response]);
        setTextMessage("");
        sendResponse(response.text, currentAIChat?._id);
        
    }, [session, setNewMessage, setMessages, sendTextMessageError, aiUrl]);

        
    const sendResponse = useCallback(async (textMessage, currentAIChatID) => {
        if (!textMessage) return console.log("No input");

        const response = await postRequest(`${aiUrl}ai/create`, JSON.stringify({
            aichatroom: currentAIChatID,
            question: textMessage,
        }));

        console.log("AI---Sending AIChatroom ID to send message", response?.response?.text);
        console.log("AI---Sending User ID to send message", response.user);
        console.log("AI---Sending text message to send message", response.text);

        if (response.error) {
            return sendTextMessageError(response.error);
        }

        setNewMessage(response.response);
        setMessages((prev) => [...prev, response.response]);

    }, [setNewMessage, setMessages, aiUrl]);


    /*
    const updateCurrentAIChat = useCallback(async (chat) => {
        setCurrentAIChat(chat)
    }, []);*/

    //updateCurrentAIChat pass value in provider if you need later
    return (
        <AIChatContext.Provider value={{ sendResponse, onlineUsers,sendTextMessage,aiUserChats, currentAIChat,createChat , messages, isMessagesLoading , messagesError ,isaiUserChatsLoading, aiUserChatsError }}>
            {children}
        </AIChatContext.Provider>
    );
};
