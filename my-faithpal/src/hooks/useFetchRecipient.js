import { useContext, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { ChatContext } from "@/context/chatContext";

export const useFetchRecipientUser = () => {
    
    const { data: session } = useSession();
    const [recipientUser, setRecipientUser] = useState(null);
    const [error, setError] = useState(null);
    const { userChats } = useContext(ChatContext);

    const recipientId = userChats?.find((id) => id !== session?.user?._id);

    console.log("Info ", recipientId);

    useEffect(() => {
        const getUser = async () => {
            if (!recipientId) return null;
            
            try {
                
                const response = await fetch(`/api/userByID`, {
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ recipientId }) ,
                });

                const { userData } = await response.json();

                console.log(userData);

                if (response.error) {
                    setError(response.error);
                } else {
                    setRecipientUser(userData);
                }
            } catch (error) {
                setError(error.message);
                return error;
            }
        };

        getUser();
    }, [recipientId]);

    return {recipientUser};
};
