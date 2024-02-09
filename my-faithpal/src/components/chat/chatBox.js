import { ChatContext } from '@/context/chatContext';
import { useFetchRecipientUser } from '@/hooks/useChatboxFetchRecipient';
import React, { useContext } from 'react'
import styles from "@/components/chat/chat.module.css";

export default function chatBox() {

  const { currentChat, messages, isMessagesLoading } = useContext(ChatContext);
  const { recipientUser }  = useFetchRecipientUser(currentChat);

  console.log( "This is chatBox current Chat: ",currentChat)
  console.log( "This is chatBox recipient User: ",recipientUser)

  if (!recipientUser)
    return (
      <p style={{ textAlign: "center", marginTop: 10,width: "100%" }}>
        No conversation selected yet...
      </p>
    );
  
    if (isMessagesLoading)
    return (
      <p style={{ textAlign: "center", marginTop: 10,width: "100%" }}>
        Loading chat...
      </p>
    );
  
  return (
    <div className={styles.chat_box}>
    <div className={styles.chat_header}>
      <span>{recipientUser?.name}</span>
      </div>
      <div className={styles.chat_messages}>
      <div className={styles.messages_box}>
        <div className={styles.messages}>
        {messages && messages.map((messages, index) => <div  key={index} className={styles.message}>
                <span>{messages.text}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div >
  );
}
