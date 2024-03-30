"use client"

import { AIChatContext } from '@/context/aiChatContext';
import { useFetchRecipientUser } from '@/hooks/openAI/useFetchRecipient';
import moment from 'moment';
import { useSession } from 'next-auth/react';
import { useContext, useEffect, useRef, useState } from 'react';
import InputEmojiWithRef from 'react-input-emoji';
import styles from "./qa.module.css";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import { Box } from '@mui/joy';

export default function QuestionModal() {
    
    const { data: session } = useSession();
    const { currentAIChat, messages, isMessagesLoading , sendTextMessage} = useContext(AIChatContext);
    const { recipientUser } = useFetchRecipientUser(currentAIChat);
    const [textMessage, setTextMessage] = useState("");
    const [isToggled, setIsToggled] = useState(false);
    const scroll = useRef();
    const notify = () => toast("Switched to Solomon", {
    position: "bottom-left",
    style: {
        backgroundColor: "rgb(215, 203, 155)",
        color: "#996515",
        maxWidth: "fit-content",
        padding: 10
    },
    hideProgressBar: false
    });
    const secondNotify = () => toast("Switched to OpenAI", {
    position: "bottom-left",
    style: {
        backgroundColor: "rgb(215, 203, 155)",
        color: "#996515",
        maxWidth: "fit-content",
        padding: 10
    },
    hideProgressBar: false
    });

    const handleKeyPress = () => {
        // Call the function to send the message when Enter is pressed
        sendTextMessage(textMessage, currentAIChat._id, setTextMessage, isToggled);
    };

    const handleToggle = () => {
        setIsToggled(!isToggled);
        if (!isToggled) {
            notify();
        }
        else {
            secondNotify();
        }
    };

    useEffect(() => {
        scroll.current?.scrollIntoView({ behaviour: "smooth" })
    }, [messages,recipientUser]);

    
    console.log( "This is chatBox AI current Chat: ",currentAIChat)
    console.log("This is chatBox recipient User: ", recipientUser)
    console.log("These are messages:", messages)
    //console.log("Message input: ", textMessage)
    
    
    if (!recipientUser)
        return (
        <p style={{ textAlign: "center", marginTop: 10,width: "100%",fontWeight: 900 }}>
            No conversation selected yet...Refresh the page
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
                <span>RabbiGpt</span>
            </div>
        <div className={styles.chat_messages}>
            <div className={styles.messages_box}>
                <div className={styles.messages}>
                        {messages && messages.map((message, index) =>
                            <div key={index} className={message?.user === session?.user?._id ? styles.message : styles.user_message} ref={scroll}>
                    <span className={message?.user === session?.user?._id ? "" : styles.letter}>{message.text}</span>
                    <span className={styles.date}>{moment(message.createdAt).calendar()}</span>
                            </div>
            )}
                </div>
            </div>
        </div>
            <div className={styles.chat_input}>
                    <InputEmojiWithRef
                    value={textMessage}
                    onChange={setTextMessage}
                    onEnter={handleKeyPress}
                    fontFamily="nunito"
                    borderColor="rgba(72,112,223,0.2)"
                    disableRecent={true}
                    placeholder="Ask your Rabbi AI a Question? Dont be shy..." />
            <input type="checkbox" id="switch" checked={isToggled} onChange={handleToggle} /><label for="switch">{isToggled ? 'ON' : 'OFF'}</label>
            </div>
            <ToastContainer/>
        </div >
    );
}