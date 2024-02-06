"use client"

import { createContext, useState, useEffect } from "react";
import { baseUrl, getRequest } from "@/util/service";
import { useSession } from "next-auth/react";

export const ChatContext = createContext();

export const ChatContextProvider = ({ children }) => {
    const { data: session } = useSession();
    const [userChats, setUserChats] = useState(null);
    const [isUserChatsLoading, setIsUserChatsLoading] = useState(false);
    const [userChatsError, setUserChatsError] = useState(null);

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

    return (
        <ChatContext.Provider value={{ userChats, isUserChatsLoading, userChatsError }}>
            {children}
        </ChatContext.Provider>
    );
};
