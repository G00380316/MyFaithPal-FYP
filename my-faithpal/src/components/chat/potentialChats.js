import { ChatContext } from "@/context/chatContext";
import { useContext } from "react";
import styles from "@/components/chat/chat.module.css";
import { useSession } from "next-auth/react";

export default function PotentialChats () {
    const { potentialChats, createChat } = useContext(ChatContext);
    const { data: session } = useSession();

    console.log("PotentialChats: ", potentialChats);

    return (
        <>
            <div className={styles.all_users}>
                {potentialChats && potentialChats?.map((u, index) => {
                    return (
                        <div className={styles.single_user} key={index} onClick={()=> createChat(session?.user?._id, u._id)}>
                        {u.name}
                            <span className={styles.user_online}></span>
                        </div>
                    );
                })}
            </div>
        </>
    )
};

