import { createContext, useState, useEffect } from "react";
import { baseUrl, getRequest, postRequest } from "@/util/service";

export const ChatContext = createContext();

export const ChatContextProvider = ({ children, user }) => {
    const [userChats, setUserChats] = useState(null);
    const [isUserChatsLoading, setIsUserChatsLoading] = useState(false);
    const [userChatsError, setUserChatsError] = useState(null);

    useEffect(() => {
        const getUserChats = async () => {
            if (user?._id) {

                setIsUserChatsLoading(true);
                setUserChatsError(null)

                const response = await getRequest(`${baseUrl}chatroom/findall/${user?._id}`)

                setIsUserChatsLoading(true);

                if (response.error) {
                    return setUserChatsError(response)
                }

                setUserChats(response)
            }
        };

        getUserChats()
    }, [user])

    return (
        <ChatContextProvider value = {{userChats,isUserChatsLoading,userChatsError}}>{children}</ChatContextProvider>
    )
}