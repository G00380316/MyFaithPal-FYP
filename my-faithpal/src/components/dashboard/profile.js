"use client"

import BookmarksIcon from '@mui/icons-material/Bookmarks';
import FeedIcon from '@mui/icons-material/Feed';
import HelpIcon from '@mui/icons-material/Help';
import HighlightIcon from '@mui/icons-material/Highlight';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import NotesIcon from '@mui/icons-material/Notes';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import { Avatar, Box, IconButton, Stack, Tab, TabList, Tabs, Typography, tabClasses } from '@mui/joy';
import * as React from 'react';
import EditProfile from './editProfile';

import { signOut, useSession } from 'next-auth/react';
import YourPosts from './userPosts/yourPosts';
import SavedPosts from './savedPosts/savedPosts';
import Highlights from './higlights/highlights';

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

    const handleTabChange = (event, newValue) => {
        setSelectedTab(newValue);
    };

    return (
        <Box sx={{ flex: 1, width: '100%', height:`90vh`, overflow: "hidden" }}>
            <Box sx={{ px: { xs: 2, md: 6 }, display: "flex", justifyContent: "space-between" }}>
                <Typography level="h2" component="h1" sx={{ mt: 1, mb: 2 }}>
                    My Profile
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                <Avatar
                variant="none"
                size="sm"
                src={session?.user?.image}
                />
                <Box sx={{ minWidth: 0, flex: 1 }}>
                        <Typography level="title-sm">{session?.user?.name}</Typography>
                    <Typography level="body-xs">{session?.user?.email}</Typography>
                </Box>
                    <IconButton size="sm" variant="plain" color="neutral" onClick={() => signOut({callbackUrl:'http://localhost:3000/login'})}>
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
                <HelpIcon/>Support
                </Tab>
            </TabList>
            </Tabs>
            <Stack sx={Styles.root}>
                {selectedTab === 0 && <EditProfile />}
                {selectedTab === 1 && <YourPosts/>}
                {selectedTab === 2 && <SavedPosts/>}
                {selectedTab === 3 && <Highlights/>}
                {selectedTab === 4 && <div>4</div>}
                {selectedTab === 5 && <div>5</div>}
            </Stack>
        </Box>
    );
    }