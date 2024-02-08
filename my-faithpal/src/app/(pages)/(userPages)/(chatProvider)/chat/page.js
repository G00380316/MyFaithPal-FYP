"use client"

//import DisplayUser from "@/app/api/getUser"; to get from backend information from json backend
import Chatrooms from "@/components/chat/chat";
import { useContext } from "react";
import { ChatContext } from "@/context/chatContext";
import styles from "@/app/(pages)/(userPages)/(chatProvider)/chat/page.module.css";
import PotentialChats from "@/components/chat/potentialChats";


export default function Chat() {

  const { userChats, isUserChatsLoading, userChatsError } = useContext(ChatContext);

  return (
    <div className={styles.body}>
      <div style={{padding: 10}}>
      <PotentialChats/>
      </div>
        {userChats && userChats.length > 0 && (
        <div className={styles.chat_container}>
          <div className={styles.chat_box}>
              {isUserChatsLoading && <p>Loading chats...</p>}
              {userChats?.map((chat, index) => (
                <div className={styles.chat_box_item} key={index}>
                  <Chatrooms rUser={chat} key={index} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
  );
}
