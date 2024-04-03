import { useState,useEffect } from 'react';
import styles from '@/components/chat/chat.module.css';
import { useSession } from 'next-auth/react';
import { Box, Input, Stack } from '@mui/joy';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import { getRequest } from '@/util/service';
import { Avatar } from '@mui/joy';

export default function SearchPeople() {
    const { data: session } = useSession();
    const [searchQuery, setSearchQuery] = useState('');
    const [allUsers, setAllUsers] = useState([]);
    const [inputFocused, setIsInputFocused] = useState(false);


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

    return (
        <div className={styles.all_users}>
            <Stack>
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
                {inputFocused ? filteredChats.map((user, index) => (
                    user.name !== 'AI' && (
                        <div className={styles.single_user} key={index} onClick={() => handleChatAction(user._id)}>
                            <Avatar src={user?.image || ""} sx={{ borderColor: 'background.body', height: 24, width: 24, mr: 1 }} />
                            {user.name}
                        </div>
                    ))) : null}
            </Stack>
        </div>
        )
    }
