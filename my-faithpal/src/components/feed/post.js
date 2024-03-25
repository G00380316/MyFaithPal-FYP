import * as React from 'react';
import AspectRatio from '@mui/joy/AspectRatio';
import Avatar from '@mui/joy/Avatar';
import Box from '@mui/joy/Box';
import Card from '@mui/joy/Card';
import CardContent from '@mui/joy/CardContent';
import CardOverflow from '@mui/joy/CardOverflow';
import IconButton from '@mui/joy/IconButton';
import Typography from '@mui/joy/Typography';
import MoreHoriz from '@mui/icons-material/MoreHoriz';
import FavoriteBorder from '@mui/icons-material/FavoriteBorder';
import ModeCommentOutlined from '@mui/icons-material/ModeCommentOutlined';
import BookmarkBorderRoundedIcon from '@mui/icons-material/BookmarkBorderRounded';
import { Divider, Link } from '@mui/joy';

export default function Post() {
    return (
        <Card
        variant="outlined"
        sx={{
            minWidth: "fit-content",
        }}
        >
        <CardContent orientation="horizontal" sx={{ alignItems: 'center', gap: 1 }}>
            <Box
            sx={{
                position: 'relative',
                '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                bottom: 0,
                right: 0,
                m: '-2px',
                borderRadius: '50%',
                background:
                    'linear-gradient(45deg, #f09433 0%,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888 100%)',
                },
            }}
            >
            <Avatar
                size="sm"
                src="avatar.png"
                sx={{ p: 0.5, border: '2px solid', borderColor: 'background.body' }}
            />
            </Box>
            <Typography fontWeight="lg">Enoch Abiodun</Typography>
            <IconButton variant="plain" color="neutral" size="sm" sx={{ ml: 'auto' }}>
            <MoreHoriz />
            </IconButton>
        </CardContent>
        <CardOverflow>
            <AspectRatio>
            <img src="auth2.jpg" alt="" loading="lazy" />
            </AspectRatio>
            </CardOverflow>
        <CardContent>
            <Link
            component="button"
            underline="none"
            fontSize="sm"
            fontWeight="lg"
            textColor="text.primary"
            >
            8.1M Likes
            </Link>
            <Typography fontSize="sm">
            <Link
                component="button"
                color="neutral"
                fontWeight="lg"
                textColor="text.primary"
            >
                Enoch Abiodun
            </Link>{' '}
            The React component library you always wanted
            </Typography>
            <Link
            component="button"
            underline="none"
            fontSize="sm"
            startDecorator="…"
            sx={{ color: 'text.tertiary' }}
            >
            more
            </Link>
            <Link
            component="button"
            underline="none"
            fontSize="10px"
            sx={{ color: 'text.tertiary', my: 0.5 }}
            >
            2 DAYS AGO
            </Link>
        </CardContent>
        <Divider/>
        <CardContent orientation="horizontal" sx={{ display: 'flex', justifyContent: 'space-around'}}>
            <IconButton variant="plain" color="neutral" size="sm" title='Favourite'>
                <FavoriteBorder />
            </IconButton>
            <IconButton variant="plain" color="neutral" size="sm" title='Comment'>
                <ModeCommentOutlined />
            </IconButton>
            <IconButton variant="plain" color="neutral" size="sm" title='Bookmark'>
                <BookmarkBorderRoundedIcon />
            </IconButton>
        </CardContent>
        </Card>
    );
}