import { useSession } from "next-auth/react";


export async function getChats() {

    const { data: session } = useSession();

    try {
        
        const res = await fetch(`${proccess.env.FAITHPALSERVER_URL}/messages/get/${session?.user?._id}`);
        const data = await res.json();
        console.log('API Response:', data);

        return data;

    } catch (error) {

        console.error('Error fetching Bible data:', error);

        throw error;

    }
}