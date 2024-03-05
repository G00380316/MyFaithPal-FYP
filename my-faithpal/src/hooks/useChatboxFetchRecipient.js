import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

export const useFetchRecipientUser = ( userChats ) => {
    
    const { data: session } = useSession();
    const [recipientUser, setRecipientUser] = useState(null);
    const [error, setError] = useState(null);

    console.log("userChats Chatbox Info ", userChats);

    useEffect(() => {
        const getUser = async () => {

            const recipientId = userChats?.participants // Extract participants array from each chat
        .flat() // Flatten the array of arrays
        .filter(id => id !== session?.user?._id);// Find all participant IDs that are not the current user's ID

            if (!recipientId) return null;

            console.log("recipientID Chatbox Info", recipientId);

            try {
                    console.log("Sending Chatbox Recipient", recipientId);

                    const response = await fetch(`/api/userByID`, {
                        method: 'POST',
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ recipientId }) ,
                    });

                    const userData  = await response.json();

                    console.log("Data Received by API Route in Chatbox Hook", userData.user);

                    if (response.error) {
                        setError(response.error);
                    } else {
                        setRecipientUser( userData.user );
                    }
               // }
            } catch (error) {
                setError(error.message);
                return error;
            }
        };

        getUser();
    }, [userChats]);

    return {recipientUser};
};
