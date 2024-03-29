"use client"

import { createContext, useState, useEffect, useCallback } from "react";
import { baseUrl, getRequest, postRequest } from "@/util/service";
import { useSession } from "next-auth/react";
import { io } from "socket.io-client";
import  dotenv  from "dotenv";

export const ChatContext = createContext();
dotenv.config();

export const ChatContextProvider = ({ children }) => {
    
    const { data: session } = useSession();
    const [userChats, setUserChats] = useState(null);
    const [isUserChatsLoading, setIsUserChatsLoading] = useState(false);
    const [userChatsError, setUserChatsError] = useState(null);
    const [potentialChats, setPotentialChats] = useState([]);
    const [currentChat, setCurrentChat] = useState(null);
    const [messages, setMessages] = useState(null);
    const [isMessagesLoading, setIsMessagesLoading] = useState(false);
    const [messagesError, setMessagesError] = useState(null);
    const [sendTextMessageError, setSendTextMessageError] = useState(null);
    const [newMessage, setNewMessage] = useState(null);
    const [socket, setSocket] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);

    console.log("Online Users:", onlineUsers);

    useEffect(() => {
        const newSocket = io(`http://localhost:8000`);
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
        
        console.log("I need", currentChat)
        
        const recipientId = currentChat.participants // Extract participants array from each chat
        .flat() // Flatten the array of arrays
            .filter(id => id !== session?.user?._id);
        
        console.log("I need", recipientId)
        
        socket.emit("sendMessage", { ...newMessage, recipientId });
    }, [newMessage]);

    //receive message
    useEffect(() => {
        if (socket === null) return;
        
        socket.on("getMessage", (res) => {
            
            if (currentChat?._id !== res.chatroom) return
            
            setMessages((prev) => [...prev, res]);
        });
        
        return () => {
            socket.off("getMessage")
        }

    }, [newMessage,socket,currentChat]);
        
    useEffect(() => {

        const getUsers = async () => {
            const response = await getRequest(`/api/getAllUsers`);
            
            console.log("Array of Users",response);

            if (response.error) {
                return console.log("Error getting Users", response)
            }

            const pChats = response?.user?.filter((u) => {
                let isChatCreated = false;

                if (session?.user?._id === u._id) return false;

                if (userChats) {
                    isChatCreated = userChats?.some((chat) => {
                        return chat.participants[0] === u._id || chat.participants[1] === u._id
                    })
                }
                
                return !isChatCreated;
            });
            console.log("Potential Users to Chat",pChats);
            setPotentialChats(pChats)
        };

        getUsers();

    }, [userChats]);
        
    useEffect(() => {
        const getUserChats = async () => {
            if (session?.user?._id) {
                setIsUserChatsLoading(true);
                setUserChatsError(null);

                const response = await getRequest(`${baseUrl}chatroom/findall/${session?.user?._id}`);

                setIsUserChatsLoading(false);

                if (response.error) {
                    return setUserChatsError(response);
                }

                console.log(response);
                
                setUserChats(response);
            }
        };

        getUserChats();
    }, [session]);

    useEffect(() => {
        const getMessages = async () => {

            setIsMessagesLoading(true);
            setMessagesError(null);

            const response = await getRequest(`${baseUrl}message/get/${currentChat?._id}`);

            setIsMessagesLoading(false);

            if (response.error) {
                return setMessagesError(response);
            }

            console.log(response);
                
            setMessages(response);
        };

        getMessages();
    }, [currentChat]);

    const sendTextMessage = useCallback( async (textMessage, currentChatID, setTextMessage) => {
        if (!textMessage) return console.log("No input");

        console.log("Sending Chatroom ID to send message", currentChatID)
        console.log("Sending User ID to send message", session?.user?._id)
        console.log("Sending text message to send message", textMessage)

        const response = await postRequest(`${baseUrl}message/create`, JSON.stringify({
            chatroom: currentChatID, user: session?.user?._id, text: textMessage,
        }));

        if (response.error) {
                return sendTextMessageError(response);
        }

        setNewMessage(response);
        setMessages((prev) => [...prev, response]);
        setTextMessage("");
        
    }, [session, setNewMessage, setMessages, sendTextMessageError, baseUrl]);

    const updateCurrentChat = useCallback(async (chat) => {
        setCurrentChat(chat)
    }, []);

    const createChat = useCallback(async (firstId, secondId) => {
        const response = await postRequest(`${baseUrl}chatroom/create`,
            JSON.stringify({
                firstId, secondId,
            })
        );

        if (response.error) {
            return console.log("Error creating chat", response);
        }

        setUserChats((prev) => [...prev, response]);
    }, []);

    return (
        <ChatContext.Provider value={{ onlineUsers,sendTextMessage,userChats,potentialChats, currentChat,createChat , messages, isMessagesLoading , messagesError ,updateCurrentChat,isUserChatsLoading, userChatsError }}>
            {children}
        </ChatContext.Provider>
    );
};
