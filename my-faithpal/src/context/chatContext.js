"use client"

import { createContext, useState, useEffect, useCallback } from "react";
import { baseUrl, getRequest } from "@/util/service";
import { useSession } from "next-auth/react";

export const ChatContext = createContext();

export const ChatContextProvider = ({ children }) => {
    const { data: session } = useSession();
    const [userChats, setUserChats] = useState(null);
    const [isUserChatsLoading, setIsUserChatsLoading] = useState(false);
    const [userChatsError, setUserChatsError] = useState(null);
    const [potentialChats, setPotentialChats] = useState([]);

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

    const createChat = useCallback(() => {

    },[])

    return (
        <ChatContext.Provider value={{ userChats,potentialChats, isUserChatsLoading, userChatsError }}>
            {children}
        </ChatContext.Provider>
    );
};
