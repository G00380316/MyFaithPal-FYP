"use client"

import BookmarksIcon from '@mui/icons-material/Bookmarks';
import FeedIcon from '@mui/icons-material/Feed';
import HelpIcon from '@mui/icons-material/Help';
import HighlightIcon from '@mui/icons-material/Highlight';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import NotesIcon from '@mui/icons-material/Notes';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import { Avatar, Box, IconButton, Stack, Tab, TabList, Tabs, Typography, tabClasses } from '@mui/joy';
import React, { useEffect } from 'react';
import EditProfile from './editProfile';

import { baseUrl, postRequest } from '@/util/service';
import { Person } from '@mui/icons-material';
import { signOut, useSession } from 'next-auth/react';
import Highlights from './higlights/highlights';
import Notes from './notes/notes';
import People from './people/people';
import SavedPosts from './savedPosts/savedPosts';
import Support from './support/support';
import YourPosts from './userPosts/yourPosts';

const Styles = {
    root: {
        maxHeight: '90vh',
        overflowY: 'scroll',
        '&::-webkit-scrollbar': {
        display: 'none'
        },
        '&::-webkit-scrollbar-thumb': {
        backgroundColor: 'rgba(0,0,0,0.1)',
        borderRadius: '0.25em'
        }
    }
};

export default function MyProfile() {

    const { data: session } = useSession();
    const [selectedTab, setSelectedTab] = React.useState(0);
    const [highlights, setHighlights] = React.useState([]);
    const [notes, setNotes] = React.useState([]);

    const handleTabChange = (event, newValue) => {
        setSelectedTab(newValue);
    };

    
    useEffect(() => {
        const fetchPassageData = async () => {

            const user = session?.user?._id;
            
            const getPassage = await postRequest(`${baseUrl}bible/get/user/changes`, JSON.stringify({ user }));
            
            setHighlights(getPassage);
            setNotes(getPassage);
        }

        fetchPassageData()

    }, [session]);

    return (
        <Box sx={{ flex: 1, width: '100%', height:`90vh`, overflow: "hidden" }}>
            <Box sx={{ px: { xs: 2, md: 6 }, display: "flex", justifyContent: "space-between" }}>
                <Typography level="h2" component="h1" sx={{ mt: 1, mb: 2 }}>
                    Profile
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                <Avatar
                variant="none"
                size="sm"
                src={session?.user?.image}
                />
                <Box sx={{ minWidth: 0, flex: 1 }}>
                        <Typography level="title-sm">{session?.user?.username || session?.user?.name}</Typography>
                    <Typography level="body-xs">{session?.user?.email}</Typography>
                </Box>
                    <IconButton size="sm" variant="plain" color="neutral" onClick={() => signOut({callbackUrl:`${process.env.NEXT_PUBLIC_CLIENT_URL}/login`})}>
                    <LogoutRoundedIcon />
                    </IconButton>
                </Box>
            </Box>
            <Tabs
            value={selectedTab}
            onChange={handleTabChange}
            defaultValue={0}
            sx={{
                bgcolor: 'transparent',
            }}
            >
            <TabList
                tabFlex={1}
                size="sm"
                sx={{
                pl: { xs: 0, md: 4 },
                justifyContent: 'left',
                [`&& .${tabClasses.root}`]: {
                    fontWeight: '600',
                    flex: 'initial',
                    color: 'text.tertiary',
                    [`&.${tabClasses.selected}`]: {
                    bgcolor: 'transparent',
                    color: 'text.primary',
                    '&::after': {
                        height: '2px',
                        bgcolor: 'primary.500',
                    },
                    },
                },
                }}
            >
                <Tab sx={{borderRadius: '6px 6px 0 0',alignItems: "center",display: 'flex',justifyContent: 'center'}} indicatorInset value={0}>
                    <SettingsRoundedIcon />Edit Profile
                </Tab>
                <Tab sx={{ borderRadius: '6px 6px 0 0',alignItems: "center",display: 'flex',justifyContent: 'center'}} indicatorInset value={1}>
                    <FeedIcon/>Your Posts
                </Tab>
                <Tab sx={{ borderRadius: '6px 6px 0 0',alignItems: "center",display: 'flex',justifyContent: 'center'}} indicatorInset value={2}>
                    <BookmarksIcon/>Saved Posts
                </Tab>
                <Tab sx={{ borderRadius: '6px 6px 0 0',alignItems: "center",display: 'flex',justifyContent: 'center'}} indicatorInset value={3}>
                    <HighlightIcon/>Highlights
                </Tab>
                <Tab sx={{ borderRadius: '6px 6px 0 0',alignItems: "center",display: 'flex',justifyContent: 'center' }} indicatorInset value={4}>
                    <NotesIcon/>Saved Notes
                </Tab>
                <Tab sx={{ borderRadius: '6px 6px 0 0',alignItems: "center",display: 'flex',justifyContent: 'center' }} indicatorInset value={5}>
                <Person/>People
                </Tab>
                <Tab sx={{ borderRadius: '6px 6px 0 0',alignItems: "center",display: 'flex',justifyContent: 'center' }} indicatorInset value={6}>
                <HelpIcon/>Support
                </Tab>
            </TabList>
            </Tabs>
            <Stack sx={Styles.root}>
                {selectedTab === 0 && <EditProfile />}
                {selectedTab === 1 && <YourPosts/>}
                {selectedTab === 2 && <SavedPosts/>}
                {selectedTab === 3 && <Highlights highlights={highlights} />}
                {selectedTab === 4 && <Notes notes={notes} />}
                {selectedTab === 5 && <People/>}
                {selectedTab === 6 && <Support/>}
            </Stack>
        </Box>
    );
    }