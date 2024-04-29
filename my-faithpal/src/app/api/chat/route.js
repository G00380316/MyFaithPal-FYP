import { useSession } from "next-auth/react";
export const dynamic = 'force-dynamic';

export async function getChats() {

    const { data: session } = useSession();

    try {
        
        const res = await fetch(`${proccess.env.FAITHPALSERVER_URL}/messages/get/${session?.user?._id}`,{cache: 'no-store'});
        const data = await res.json();
        //console.log('API Response:', data);

        return data;

    } catch (error) {

        console.error('Error fetching messages data:', error);

        throw error;

    }
}