import { useState,useEffect } from 'react';
import { useContext } from 'react';
import styles from '@/components/chat/chat.module.css';
import { useSession } from 'next-auth/react';
import { Box, Input } from '@mui/joy';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import { ChatContext } from '@/context/chatContext';
import { getRequest } from '@/util/service';
import { Avatar } from '@mui/joy';

export default function PotentialChats() {
    const { potentialChats, createChat, onlineUsers, updateCurrentChat, userChats } = useContext(ChatContext);
    const { data: session } = useSession();
    const [searchQuery, setSearchQuery] = useState('');
    const [allUsers, setAllUsers] = useState([]);
    const [inputFocused, setIsInputFocused] = useState(false);

    /*
    useEffect(() => {
        const getUsers = async () => {
            const response = await getRequest(`/api/getAllUsers`);

            if (response.error) {
                console.log("Error getting Users", response);
                return;
            }

            const users = response?.user?.filter(u => u._id !== session?.user?._id);
            setAllUsers(users);
        };

        getUsers();
    }, [session]);*/

    const fetchAllUsers = async () => {
        const response = await getRequest(`/api/getAllUsers`);

        if (response.error) {
            console.log("Error getting Users", response);
            return;
        }

        const users = response?.user?.filter(u => u._id !== session?.user?._id);
        setAllUsers(users);
    };

    useEffect(() => {

        if (inputFocused) {
            fetchAllUsers();
        }

    }, [inputFocused]);

    const filteredChats = allUsers.filter(user => user.name.toLowerCase().includes(searchQuery.toLowerCase()));

    const handleChatAction = (userId) => {

        const existingChat = userChats?.find(chat =>
            (chat.participants?.includes(session?.user?._id) && chat.participants.includes(userId))
        );

        if (existingChat) {

            updateCurrentChat(existingChat);

        } else {
        
            createChat(session?.user?._id, userId);
        
        }
    };

    return (
        <div className={styles.all_users}>
            <Box marginRight={1} minWidth="312px">
                <Input
                    size="sm"
                    startDecorator={<SearchRoundedIcon />}
                    placeholder="Search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setIsInputFocused(true)}
                    onBlur={() => setIsInputFocused(false)}
                />
            </Box>
                {inputFocused || searchQuery.trim() !== ''  ?
                filteredChats.map((user, index) => (
                    user.name !== 'AI' && (
                        <div className={styles.single_user} key={index} onClick={() => handleChatAction(user._id)}>
                            <Avatar src={user?.image || ""} sx={{ borderColor: 'background.body', height:24, width:24, mr:1 }}/>
                            {user.name}
                            <span className={onlineUsers?.some(onlineUser => onlineUser.userID === user._id) ? styles.user_online : ''}></span>
                        </div>
                    )))
                :
                potentialChats.map((user, index) => (
                    user.name !== 'AI' && (
                        <div className={styles.single_user} key={index} onClick={() => handleChatAction(user._id)}>
                            <Avatar src={user?.image || ""} sx={{ borderColor: 'background.body', height:24, width:24, mr:1 }}/>
                            {user.name}
                            <span className={onlineUsers?.some(onlineUser => onlineUser.userID === user._id) ? styles.user_online : ''}></span>
                        </div>)))}
                    </div>
                );
            }
