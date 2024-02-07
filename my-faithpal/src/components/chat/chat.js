import React from "react";
import styles from "@/components/chat/chat.module.css";
import { useFetchRecipientUser } from "@/hooks/useFetchRecipient";

export default function Chat(userChats) {
    
    const { recipientUser } = useFetchRecipientUser(userChats);

    console.log("Passed to component: ", recipientUser);

    var name = recipientUser?.name || "Unknown";

    return (
        <div className={styles.button}>
            <div style={{ marginRight: '2px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                <img src="/avatar.png" height="20px" alt="Avatar" />
                <div className={styles.user_card}>
                    <div className={styles.name}>{name}</div>
                    <div className={styles.text}>Text Message</div>
                </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                <div className={styles.date}>12/12/2022</div>
                <div className={styles.this_user_notifications}>2</div>
                <span className={styles.user_online}></span>
            </div>
        </div>
    );
}
