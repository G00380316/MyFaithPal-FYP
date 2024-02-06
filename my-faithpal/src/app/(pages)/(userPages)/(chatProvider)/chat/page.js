"use client"

//import DisplayUser from "@/app/api/getUser"; to get from backend information from json backend
import Chatrooms from "@/components/chat/chat";
import { useContext } from "react";
import { ChatContext } from "@/context/chatContext";
import styles from "@/app/(pages)/(userPages)/(chatProvider)/chat/page.module.css";

export default function Chat() {

  const { userChats, isUserChatsLoading, userChatsError } = useContext(ChatContext);

  return (
      <div className={styles.body}>
        {userChats && userChats.length > 0 && (
          <div className={styles.chat_container}>
            <div className= {styles.chat_box}>
              {isUserChatsLoading && <p>Loading chats...</p>}
              {userChats?.map((index) => (
                <div className={styles.chat_box_item} key={index}>
                  <Chatrooms/>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
  );
}
