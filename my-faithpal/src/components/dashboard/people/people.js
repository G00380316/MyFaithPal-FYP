import { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { Box, Input, Typography, Grid, Stack, Avatar } from '@mui/joy';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import { getRequest } from '@/util/service';
import PeopleCards from './peopleCards';

export default function People() {
    
    const { data: session } = useSession();
    const [searchQuery, setSearchQuery] = useState('');
    const [allUsers, setAllUsers] = useState([]);
    const [inputFocused, setInputFocused] = useState(false);
    const [optionsOpen, setOptionsOpen] = useState(false);
    const [displayUser, setDisplayUser] = useState(null)
    const wrapperRef = useRef(null);

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
            setOptionsOpen(true);
        }
    }, [inputFocused]);

    useEffect(() => {

        function handleClickOutside(event) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setOptionsOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {

            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [wrapperRef]);

    const filteredChats = allUsers.filter(user => user.name.toLowerCase().includes(searchQuery.toLowerCase()));

    const handleSelectUser = (user) => {
        console.log("This 1", user);
        setDisplayUser(user);
        setOptionsOpen(false);
    };

    return (
        <main>
            <Grid container direction="row" justifyContent="space-around" alignItems="stretch">
                <Grid></Grid>
                <Grid>
                    <Stack spacing={1} marginTop={1}>
                        <Stack >
                            <Box minWidth="350px" ref={wrapperRef}>
                                <Input
                                    size="sm"
                                    startDecorator={<SearchRoundedIcon />}
                                    placeholder="Search"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onFocus={() => setInputFocused(true)}
                                    onBlur={() => setInputFocused(false)}
                                />
                                {optionsOpen && (
                                    <Box
                                        sx={{
                                            maxHeight: '165px',
                                            overflowY: 'auto',
                                            '&::-webkit-scrollbar': {
                                                display: 'none'
                                            },
                                            scrollbarWidth: 'none',
                                            '-ms-overflow-style': 'none',
                                        }}
                                    >
                                        {filteredChats.map((user, index) => (
                                            user.name !== 'AI' && (
                                                <Stack key={index}>
                                                    <Box
                                                        component="button"
                                                        display="flex"
                                                        sx={{background: "white", borderBottom: "0.01px", padding: 1}}
                                                        onClick={() => handleSelectUser(user)}
                                                    >
                                                        <Avatar src={user?.image || ""} sx={{ borderColor: 'background.body', height: 24, width: 24, mr: 1, ml: 1 }} />
                                                        <Typography color='#424949'>{user.name}</Typography>
                                                    </Box>
                                                </Stack>
                                            )
                                        ))}
                                    </Box>
                                )}
                            </Box>
                        </Stack>
                    </Stack>
                </Grid>
                <Grid></Grid>
            </Grid>
            <PeopleCards user={displayUser} />
        </main>
    );
}
