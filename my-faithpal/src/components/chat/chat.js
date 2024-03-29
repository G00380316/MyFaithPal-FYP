import React, { useContext } from "react";
import styles from "@/components/chat/chat.module.css";
import { useFetchRecipientUser } from "@/hooks/chat/useFetchRecipient";
import { ChatContext } from "@/context/chatContext";
import { Avatar } from "@mui/joy";
import moment from "moment";

export default function Chat( userChats ) {
    
    const { recipientUser } = useFetchRecipientUser(userChats);
    const { onlineUsers } = useContext(ChatContext);

    const isUserOnline = onlineUsers?.some(user => user.userID === recipientUser?._id);

    console.log("this Passed to component: ", recipientUser);
    console.log("Passed to component: ", userChats?.rUser?.createdAt);

    var name = recipientUser?.name || "Unknown";

    return (
        <div className={styles.button}>
            <div style={{ marginRight: '2px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                <Avatar size="sm" src={recipientUser?.image || ""} sx={{ borderColor: 'background.body' }}/>
                <div className={styles.user_card}>
                    <div className={styles.name}>{name}</div>
                    <div className={styles.text}>Text Message</div>
                </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                <span className={isUserOnline ? styles.user_online_chats : ""}></span>
                <div style={{display: "flex" , flexDirection:"column",alignItems: 'flex-end'}}>
                    <div className={styles.date}>{moment(userChats?.rUser?.createdAt).calendar()}</div>
                    <div className={styles.this_user_notifications}>2</div>
                </div>
            </div>
            
        </div>
    );
}
