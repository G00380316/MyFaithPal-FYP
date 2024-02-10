import { ChatContext } from '@/context/chatContext';
import { useFetchRecipientUser } from '@/hooks/useChatboxFetchRecipient';
import React, { useContext, useState } from 'react'
import styles from "@/components/chat/chat.module.css";
import moment from 'moment';
import { useSession } from 'next-auth/react';
import InputEmojiWithRef from 'react-input-emoji';

export default function chatBox() {

  const { data: session } = useSession();
  const { currentChat, messages, isMessagesLoading , sendTextMessage} = useContext(ChatContext);
  const { recipientUser } = useFetchRecipientUser(currentChat);
  const [textMessage, setTextMessage] = useState("");

  console.log( "This is chatBox current Chat: ",currentChat)
  console.log("This is chatBox recipient User: ", recipientUser)
  console.log("These are messages:", messages)
  console.log("Message input: ", textMessage)

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
        {messages && messages.map((message, index) => <div  key={index} className={message?.user === session?.user?._id ? styles.message : styles.user_message}>
          <span>{message.text}</span>
          <span className={styles.date}>{moment(message.createdAt).calendar()}</span>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className={styles.chat_input}>
        <InputEmojiWithRef value={textMessage} onChange={setTextMessage} fontFamily="nunito" borderColor="rgba(72,112,223,0.2)" />
        <button className={styles.send_button} onClick={() => sendTextMessage(textMessage , currentChat._id , setTextMessage)}>Send</button>
      </div>
    </div >
  );
}
