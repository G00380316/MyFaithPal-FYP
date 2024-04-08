import { ChatContext } from "@/context/chatContext";
import { baseUrl, getRequest } from "@/util/service";
import { useContext, useEffect, useState } from "react";

export const useFetchLastMessage = ( userChats ) => {

    const { newMessage, notifications } = useContext(ChatContext);
    const [latestMessage, setLatestMessage] = useState(null);

    //console.log("userChats Info ", userChats);

    useEffect(() => {
        const getMessages = async () => {
            const response = await getRequest(`${baseUrl}message/get/${userChats?.rUser?._id}`);

            if (response.error) {
                return //console.log("Error message getting...", response.error);
            }

            const lastMessage = response[response?.length - 1];

            setLatestMessage(lastMessage)
        };
        getMessages();
    }, [newMessage, notifications]);

    return {latestMessage};
};
