"use client"

import * as React from 'react';
import GlobalStyles from '@mui/joy/GlobalStyles';
import Avatar from '@mui/joy/Avatar';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import Card from '@mui/joy/Card';
import Chip from '@mui/joy/Chip';
import Divider from '@mui/joy/Divider';
import IconButton from '@mui/joy/IconButton';
import Input from '@mui/joy/Input';
import LinearProgress from '@mui/joy/LinearProgress';
import List from '@mui/joy/List';
import ListItem from '@mui/joy/ListItem';
import ListItemButton, { listItemButtonClasses } from '@mui/joy/ListItemButton';
import ListItemContent from '@mui/joy/ListItemContent';
import Typography from '@mui/joy/Typography';
import Sheet from '@mui/joy/Sheet';
import Stack from '@mui/joy/Stack';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded';
import ShoppingCartRoundedIcon from '@mui/icons-material/ShoppingCartRounded';
import QuestionAnswerRoundedIcon from '@mui/icons-material/QuestionAnswerRounded';
import SupportRoundedIcon from '@mui/icons-material/SupportRounded';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import BrightnessAutoRoundedIcon from '@mui/icons-material/BrightnessAutoRounded';
import { signOut } from "next-auth/react";



export default function Sidebar() {


    return (
        <Sheet
        className="Sidebar"
        sx={{
            transition: 'transform 0.4s, width 0.4s',
            height: '100dvh',
            width: 'var(--Sidebar-width)',
            top: 0,
            p: 2,
            flexShrink: 0,
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            borderRight: '1px solid',
            borderColor: 'divider',
        }}
        >
        <GlobalStyles
            styles={(theme) => ({
            ':root': {
                '--Sidebar-width': '220px',
                [theme.breakpoints.up('lg')]: {
                '--Sidebar-width': '240px',
                },
            },
            })}
        />
        <Box
        />
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <IconButton variant="soft" color="primary" size="sm">
            <BrightnessAutoRoundedIcon />
            </IconButton>
            <Typography level="title-lg">Acme Co.</Typography>
        </Box>
        <Input size="sm" startDecorator={<SearchRoundedIcon />} placeholder="Search" />
        <Box
            sx={{
            minHeight: 0,
            overflow: 'hidden auto',
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',
            [`& .${listItemButtonClasses.root}`]: {
                gap: 1.5,
            },
            }}
        >
            <List
            size="sm"
            sx={{
                gap: 1,
                '--List-nestedInsetStart': '30px',
                '--ListItem-radius': (theme) => theme.vars.radius.sm,
            }}
            >
            <ListItem>
                <ListItemButton>
                <HomeRoundedIcon />
                <ListItemContent>
                    <Typography level="title-sm">Home</Typography>
                </ListItemContent>
                </ListItemButton>
            </ListItem>

            <ListItem>
                <ListItemButton>
                <DashboardRoundedIcon />
                <ListItemContent>
                    <Typography level="title-sm">Dashboard</Typography>
                </ListItemContent>
                </ListItemButton>
            </ListItem>

            <ListItem>
                <ListItemButton
                role="menuitem"
                component="a"
                onClick={() => signOut({callbackUrl:'http://localhost:3000/login'})}
                >
                <LogoutRoundedIcon />
                <ListItemContent>
                    <Typography level="title-sm">Logout</Typography>
                </ListItemContent>
                </ListItemButton>
            </ListItem>
            <ListItem nested>
            </ListItem>
            <ListItem>
                <ListItemButton
                role="menuitem"
                component="a"
                href="/chat"
                >
                <QuestionAnswerRoundedIcon />
                <ListItemContent>
                    <Typography level="title-sm">Messages</Typography>
                </ListItemContent>
                <Chip size="sm" color="primary" variant="solid">
                    4
                </Chip>
                </ListItemButton>
            </ListItem>
            <ListItem nested>
            </ListItem>
            </List>
            <List
            size="sm"
            sx={{
                mt: 'auto',
                flexGrow: 0,
                '--ListItem-radius': (theme) => theme.vars.radius.sm,
                '--List-gap': '8px',
                mb: 2,
            }}
            >
            <ListItem>
                <ListItemButton>
                <SupportRoundedIcon />
                Support
                </ListItemButton>
            </ListItem>
            <ListItem>
                <ListItemButton>
                <SettingsRoundedIcon />
                Settings
                </ListItemButton>
            </ListItem>
            </List>
            <Card
            invertedColors
            variant="soft"
            color="warning"
            size="sm"
            sx={{ boxShadow: 'none' }}
            >
            <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography level="title-sm">Used space</Typography>
                <IconButton size="sm">
                <CloseRoundedIcon />
                </IconButton>
            </Stack>
            <Typography level="body-xs">
                Your team has used 80% of your available space. Need more?
            </Typography>
            <LinearProgress variant="outlined" value={80} determinate sx={{ my: 1 }} />
            <Button size="sm" variant="solid">
                Upgrade plan
            </Button>
            </Card>
        </Box>
        <Divider />
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <Avatar
            variant="outlined"
            size="sm"
            src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=286"
            />
            <Box sx={{ minWidth: 0, flex: 1 }}>
            <Typography level="title-sm">Siriwat K.</Typography>
            <Typography level="body-xs">siriwatk@test.com</Typography>
            </Box>
            <IconButton size="sm" variant="plain" color="neutral">
            <LogoutRoundedIcon />
            </IconButton>
        </Box>
        </Sheet>
    );
}