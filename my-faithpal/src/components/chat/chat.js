import { useEffect, useState } from 'react';
import socket from '../socket';

export default function Chat () {

    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');

    useEffect(() => {
    socket.on('message', (message) => {
        setMessages((prevMessages) => [...prevMessages, message]);
    });
    }, []);
    
    const sendMessage = () => {
    if (input) {
        socket.emit('message', input);
        setInput('');
    }
    };

    return (
    <div>
        <ul>
        {messages.map((message, index) => (
            <li key={index}>{message}</li>
        ))}
        </ul>
        <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        />
        <button onClick={sendMessage}>Send</button>
    </div>
    );
};