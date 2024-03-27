import * as React from 'react';
import { AspectRatio,Avatar, Box, Card , CardContent , CardOverflow , IconButton, Typography, Divider, Link } from '@mui/joy';
import { MoreHoriz, FavoriteBorder , Favorite, ModeCommentOutlined} from '@mui/icons-material';
import BookmarkBorderRoundedIcon from '@mui/icons-material/BookmarkBorderRounded';
import { useState } from 'react';
import moment from 'moment';
import { baseUrl, postRequest } from '@/util/service';
import { useSession } from 'next-auth/react';

export default function Post({ _id, content, media, likes, user, createdAt }) {

    const [UserData, setUserData] = useState("");
    const [isLiked, setLiked] = useState(false);
    const [newPostInfo, setnewPostInfo] = useState("");
    const { data: session } = useSession();
    const [expanded, setExpanded] = useState(false);
    const contentLengthToShow = 2;

    const toggleExpanded = () => {
        setExpanded(!expanded);
    };

    React.useEffect(() => {
        const checkIFLike = async () => {

            const response = await fetch(`${baseUrl}post/byId`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ postId: _id }),
            });

            const postData = await response.json();

            if (postData?.likes?.includes(session?.user?._id)) {
                setLiked(true);
            } else {
                setLiked(false);
            }
        }

        checkIFLike();

    }, [session]);

    React.useEffect(() => {

        const fetchData = async () => {
            try {

                const response = await fetch(`/api/userByID`, {
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ user }),
                });

                const userData = await response.json();

                console.log(userData)
                setUserData(userData || "");
                
            } catch (error) {
                
                console.error('Error getting User Data:', error);
                setError(error.message || 'An error occurred while getting data');

            }
        }

        fetchData();
    }, [user]);


    const handleLikes = async () => {

        if (!isLiked) {

            const newLikesArray = likes.includes(session?.user?._id) ? likes : [...likes, session?.user?._id];

            console.log(newLikesArray)
            console.log(_id)
            
            const updatedPost = await postRequest(`${baseUrl}post/update`, JSON.stringify({
                postId: _id,
                likes: newLikesArray,
            }))

            if (updatedPost?.likes.includes(session?.user?._id)) {
                setLiked(true);
            } else {
                setLiked(false);
            }

            setnewPostInfo(updatedPost);

            console.log("Added like to: ", updatedPost);

        } else {

            const newLikesArray = likes.filter(id => id !== session?.user?._id);

            console.log(newLikesArray)
            console.log(_id)

            const updatedPost = await postRequest(`${baseUrl}post/update`, JSON.stringify({
                postId: _id,
                likes: newLikesArray,
            }))

            if (updatedPost?.likes.includes(session?.user?._id)) {
                setLiked(true);
            } else {
                setLiked(false);
            }

            setnewPostInfo(updatedPost);
            
            console.log("Removed like from: ", updatedPost);
        }
    }

    //no text
    if (!content) {
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
                    <Typography fontWeight="lg">{UserData?.user?.name}</Typography>
                <IconButton variant="plain" color="neutral" size="sm" sx={{ ml: 'auto' }}>
                <MoreHoriz />
                </IconButton>
            </CardContent>
            <CardOverflow>
                <AspectRatio>
                        <img src={media} alt="" loading="lazy" />
                </AspectRatio>
                </CardOverflow>
                <CardContent >
                    <Typography fontSize="sm">
                        <CardContent orientation='horizontal' sx={{justifyContent: "space-between"}}>
                            <Link
                                component="button"
                                color="neutral"
                                fontWeight="lg"
                                textColor="text.primary"
                            >
                                {UserData?.user?.name}
                            </Link>
                            <Link
                                component="button"
                                underline="none"
                                fontSize="sm"
                                fontWeight="lg"
                                textColor="text.primary"
                            >
                                {newPostInfo?.likes?.length || likes?.length || 0} Likes
                            </Link>
                        </CardContent>
                </Typography>
                <CardContent orientation='horizontal' sx={{ justifyContent: "space-between" }}>
                        <Link
                            component="button"
                            underline="none"
                            fontSize="10px"
                            sx={{ color: 'text.tertiary', my: 0.5 }}
                        >
                            {moment(createdAt).calendar()}
                        </Link>
                    </CardContent>
            </CardContent>
            <Divider/>
            <CardContent orientation="horizontal" sx={{ display: 'flex', justifyContent: 'space-around'}}>
                <IconButton variant="plain" color="neutral" size="sm" title='Favourite' onClick={handleLikes}>
                    {isLiked ? <Favorite /> : <FavoriteBorder />}
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
    
    //no image
    if (!media) {
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
                <Typography fontWeight="lg">{UserData?.user?.name}</Typography>
            <IconButton variant="plain" color="neutral" size="sm" sx={{ ml: 'auto' }}>
            <MoreHoriz />
            </IconButton>
        </CardContent>
            <CardContent>
                    <CardContent orientation='horizontal' sx={{ justifyContent: "space-between" }}>
                        <Typography fontSize="sm">
                            <Link
                                component="button"
                                color="neutral"
                                fontWeight="lg"
                                textColor="text.primary"
                            >
                                {UserData?.user?.name}
                            </Link>{' '}
                            {expanded ? content : content.substring(0, contentLengthToShow)}
                        </Typography>
                            <Link
                                component="button"
                                underline="none"
                                fontSize="sm"
                                fontWeight="lg"
                                textColor="text.primary"
                            >
                                {newPostInfo?.likes?.length || likes?.length || 0} Likes
                            </Link>
                    </CardContent>
            {content.length > contentLengthToShow && (
                <Link
                    component="button"
                    underline="none"
                    fontSize="sm"
                    startDecorator="…"
                    sx={{ color: 'text.tertiary' }}
                    onClick={toggleExpanded}
                >
                    {expanded ? "less" : "more"}
                </Link>
            )}
            <CardContent orientation='horizontal' sx={{ justifyContent: "space-between" }}>
                <Link
                    component="button"
                    underline="none"
                    fontSize="10px"
                    sx={{ color: 'text.tertiary', my: 0.5 }}
                >
                    {moment(createdAt).calendar()}
                </Link>
            </CardContent>
        </CardContent>
        <Divider/>
        <CardContent orientation="horizontal" sx={{ display: 'flex', justifyContent: 'space-around'}}>
            <IconButton variant="plain" color="neutral" size="sm" title='Favourite' onClick={handleLikes}>
                {isLiked ? <Favorite /> : <FavoriteBorder />}
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
    
    //Default behaviour
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
                    <Typography fontWeight="lg">{UserData?.user?.name}</Typography>
                <IconButton variant="plain" color="neutral" size="sm" sx={{ ml: 'auto' }}>
                <MoreHoriz />
                </IconButton>
            </CardContent>
            <CardOverflow>
                <AspectRatio>
                        <img src={media} alt="" loading="lazy" />
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
                    {newPostInfo?.likes?.length || likes?.length || 0} Likes
                </Link>
                <Typography fontSize="sm">
                <Link
                    component="button"
                    color="neutral"
                    fontWeight="lg"
                    textColor="text.primary"
                >
                    {UserData?.user?.name}
                </Link>{' '}
                {expanded ? content : content.substring(0, contentLengthToShow)}
                </Typography>
                {content.length > contentLengthToShow && (
                    <Link
                        component="button"
                        underline="none"
                        fontSize="sm"
                        startDecorator="…"
                        sx={{ color: 'text.tertiary' }}
                        onClick={toggleExpanded}
                    >
                        {expanded ? "less" : "more"}
                    </Link>
                )}
                <Link
                component="button"
                underline="none"
                fontSize="10px"
                sx={{ color: 'text.tertiary', my: 0.5 }}
                >
                        {moment(createdAt).calendar()}
                </Link>
            </CardContent>
            <Divider/>
            <CardContent orientation="horizontal" sx={{ display: 'flex', justifyContent: 'space-around'}}>
                <IconButton variant="plain" color="neutral" size="sm" title='Favourite' onClick={handleLikes}>
                    {isLiked ? <Favorite /> : <FavoriteBorder />}
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