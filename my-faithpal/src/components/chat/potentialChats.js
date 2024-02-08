import { ChatContext } from "@/context/chatContext";
import { useContext } from "react";
import styles from "@/components/chat/chat.module.css";

export default function PotentialChats () {
    const { potentialChats } = useContext(ChatContext);

    console.log("PotentialChats: ", potentialChats);

    return (
        <>
            <div className={styles.all_users}>
                {potentialChats && potentialChats?.map((u, index) => {
                    return (
                        <div className={styles.single_user} key={index}>
                        {u.name}
                            <span className={styles.user_online}></span>
                        </div>
                    );
                })}
            </div>
        </>
    )
};

