import { useSession } from "next-auth/react";
import React, { useState } from "react";

export default function Chat () {

    const { data: session} = useSession()

    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');

    const handleInputChange = (e) => {
    setNewMessage(e.target.value);
    };

    const handleSendMessage = () => {
    if (newMessage.trim() === '') return;

    const updatedMessages = [...messages, { text: newMessage, sender: 'user' }];
    setMessages(updatedMessages);
    setNewMessage('');
    };
    
    return (
    <div className="chat-container">
        <div className="chat-messages">
        {messages.map((message, index) => (
            <div key={index} className={`message ${message.sender}`}>
            {message.text}
            </div>
        ))}
        </div>
        <div className="chat-input">
        <input
            type="text"
            placeholder= {`${session?.user?._id} Type a message...`}
            value={newMessage}
            onChange={handleInputChange}
        />
        <button onClick={handleSendMessage}>Send</button>
        </div>
    </div>
    );
};