import { useState } from 'react';
import { useContext } from 'react';
import styles from '@/components/chat/chat.module.css';
import { useSession } from 'next-auth/react';
import { Box, Input } from '@mui/joy';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import { ChatContext } from '@/context/chatContext';

export default function PotentialChats() {
    const { potentialChats, createChat, onlineUsers } = useContext(ChatContext);
    const { data: session } = useSession();
    const [searchQuery, setSearchQuery] = useState('');

    // Filter potential chats based on search query
    const filteredChats = potentialChats.filter(chat => chat.name.toLowerCase().includes(searchQuery.toLowerCase()));

    return (
        <div className={styles.all_users}>
            <Box marginRight={1} minWidth="312px">
                <Input
                    size="sm"
                    startDecorator={<SearchRoundedIcon />}
                    placeholder="Search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </Box>
            {filteredChats.map((u, index) => {
                const isUserOnline = onlineUsers?.some(user => user.userID === u._id);
                if (u.name === 'AI') {
                    return null;
                }
                return (
                    <div
                        className={styles.single_user}
                        key={index}
                        onClick={() => createChat(session?.user?._id, u._id)}
                    >
                        {u.name}
                        <span className={isUserOnline ? styles.user_online : ''}></span>
                    </div>
                );
            })}
        </div>
    );
}
