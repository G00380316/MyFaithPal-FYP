"use client"

import Chatrooms from "@/components/chat/chat";
import { useContext } from "react";
import { ChatContext } from "@/context/chatContext";
import styles from "@/app/(pages)/(userPages)/(chatProvider)/chat/page.module.css";
import PotentialChats from "@/components/chat/potentialChats";
import ChatBox from "@/components/chat/chatBox";

export default function Chat() {

  const { userChats, isUserChatsLoading, updateCurrentChat } = useContext(ChatContext);

  return (
    <div className={styles.body}>
      <div className={styles.chat_container}>
            <PotentialChats />
          <div style={{ display: "flex"}}>
            <div className={styles.chat_box} >
            {isUserChatsLoading && <p>Loading chats...</p>}
            {userChats?.map((chat, index) => (
              <div className={styles.chat_box_item} key={index} onClick={() => updateCurrentChat( chat )}>
                <Chatrooms rUser={chat} />
              </div>
            ))}
          </div>
            <div className={styles.chat_box_right} >
              <ChatBox/>
            </div>
          </div>
        </div>
      </div>
  );
}
