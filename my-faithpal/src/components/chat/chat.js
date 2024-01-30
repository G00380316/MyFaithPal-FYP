import { useSession } from "next-auth/react";

export default function Chat () {

    const { data: session} = useSession()

    return (
    <div>
        <p>Hello {session?.user?.name} </p>
    </div>
    );
};