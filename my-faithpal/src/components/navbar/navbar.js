"use client"

import Link from "next/link"
import styles from "@/app/page.module.css"
import navStyles from "@/components/navbar/navbar.module.css"
import { useSession } from "next-auth/react"
import { useContext, useEffect } from "react"
import { ChatContext } from "@/context/chatContext"
import { NotifyCustom } from "@/util/notify"
//import { Icons } from "react-toastify"
import moment from "moment/moment"

const image = ({ image }) => {
    return (
        <div style={{
            objectFit: "cover",
            objectPosition: "center",
        }}>
        <img src={image} alt="Sender Image" height="30" width="30" style={{borderRadius: "50%", marginRight: 2, marginTop: 5}}/>
        </div>
    )
}

export default function navbar() {
    
    const { data: session } = useSession();
    const { notifications, markAllNotificationsAsRead , allUsers , markNotificationsAsRead , userChats} = useContext(ChatContext);

    const unreadNotifications = notifications.filter((noti) => noti.isRead == false)
    const modifiedNotifications = notifications.map((noti) => {
        const sender = allUsers?.find((user) => user._id === noti.senderId)

        return {
            ...noti,
            senderName: sender?.name,
            senderUsername: sender?.username,
            senderImage: sender?.image,
        };
    });
    console.log("noti", modifiedNotifications)

    useEffect(() => {
        
        const allUnreadNotifications = () => {

            if (unreadNotifications?.length !== 0) {
                NotifyCustom({ text: `You have ${unreadNotifications?.length} unread messages`, onClick: () => markAllNotificationsAsRead(notifications) })
                NotifyCustom({ text: `Click to mark all as read`, onClick:() => markAllNotificationsAsRead(notifications) })
            }
            const notifiedSenders = new Set();
            modifiedNotifications.forEach((mn, index) => {
                if (!notifiedSenders.has(mn.senderName) && !mn.isRead) {
                    console.log("noti 2", modifiedNotifications)
                    NotifyCustom({ text: `You have a new message from ${mn?.senderUsername || mn?.senderName}\n\n${moment(mn.date).calendar()}`, icon: image({ image: mn.senderImage || "avatar.png" }), onClick: () => markNotificationsAsRead(mn, userChats, notifications)});
                    notifiedSenders.add(mn.senderName);
                }
            });

        }

        allUnreadNotifications();

    }, [notifications]);

    

    console.log("didnt read", unreadNotifications)
    console.log("modified didnt read", modifiedNotifications)
    return (
        <nav className={navStyles.nav}>
        <Link href='/'><h1>MYFAITHPAL</h1></Link>
        <h1  style={{ height: 50 }}>_____________________</h1>
        <Link href='/bible'><p style={{ fontSize: 20 }}>Bible</p></Link>
        <Link href='/feed'><p style={{ fontSize: 20 }}>Feed</p></Link>
        <Link href='/questions'><p style={{ fontSize: 20 }}>Questions</p></Link>
        <Link href='/chat'><p style={{fontSize: 20}}>Chat</p></Link>
        {session ? (
                <Link href='/profile'><button className={styles.button}>Profile</button></Link>
            ) : (
                <Link href='/login'><button className={styles.button}>Login/Register</button></Link>
            )}
        </nav>
    )
}