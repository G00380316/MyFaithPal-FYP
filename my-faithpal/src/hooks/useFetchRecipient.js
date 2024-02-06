import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";


export const useFetchRecipientUser = (userChats) => {
    
    const { data: session } = useSession();
    const [recipientUser, setRecipientUser] = useState(null);
    const [error, setError] = useState(null);

    console.log("userChats Info ", userChats);

    const recipientId = userChats
    ?.map(chat => chat.participants) // Extract participants array from each chat
    .flat() // Flatten the array of arrays
    .filter(id => id !== session?.user?._id); // Find all participant IDs that are not the current user's ID

    console.log("recipientID Info", recipientId);

    useEffect(() => {
        const getUser = async () => {
            if (!recipientId) return null;
            
            try {
                console.log("Sending Recipient", recipientId)

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
