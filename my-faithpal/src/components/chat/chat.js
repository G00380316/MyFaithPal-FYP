import React, { useContext } from "react";
import styles from "@/components/chat/chat.module.css";
import { useFetchRecipientUser } from "@/hooks/chat/useFetchRecipient";
import { ChatContext } from "@/context/chatContext";
import { Avatar } from "@mui/joy";
import moment from "moment";
import { useFetchLastMessage } from "@/hooks/chat/useFetchLastMessage";

export default function Chat( userChats ) {
    
    const { recipientUser } = useFetchRecipientUser(userChats);
    const { onlineUsers, notifications, markThisUserNotificationsAsRead } = useContext(ChatContext);

    const { latestMessage } = useFetchLastMessage(userChats);
    const isUserOnline = onlineUsers?.some(user => user.userID === recipientUser?._id);

    const unreadNotifications = notifications.filter((noti) => noti.isRead == false);
    const thisUserNotifications = unreadNotifications?.filter((noti) =>
        noti.senderId === recipientUser?._id
    );

    const trancateText = (text) => {
        let shortText = text.substring(0, 20);

        if (text.length > 20) {
            shortText = shortText + "..."
        }

        return shortText;
    }

    var name = recipientUser?.username || recipientUser?.name || "Unknown";

    return (
        <div className={styles.button} onClick={() => {
            if (thisUserNotifications?.length !== 0) {
                markThisUserNotificationsAsRead(thisUserNotifications, notifications);
            }
        }}>
            <div style={{ marginRight: '2px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                <Avatar size="sm" src={recipientUser?.image || ""} sx={{ borderColor: 'background.body' }}/>
                <div className={styles.user_card}>
                    <div className={styles.name}>{name}</div>
                    <div className={styles.text}>{latestMessage?.text && (
                        <span>{trancateText(latestMessage?.text)}</span>
                    )}</div>
                </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                <span className={isUserOnline ? styles.user_online_chats : ""}></span>
                <div style={{display: "flex" , flexDirection:"column",alignItems: 'flex-end'}}>
                    <div className={styles.date}>{latestMessage ? moment(latestMessage?.createdAt).fromNow() : `${moment(userChats?.rUser?.createdAt).calendar()}`}</div>
                    <div className={thisUserNotifications?.length > 0 ? styles.this_user_notifications : ""}>
                        {thisUserNotifications?.length > 0 ? thisUserNotifications?.length : ""}
                    </div>
                </div>
            </div>
            
        </div>
    );
}
