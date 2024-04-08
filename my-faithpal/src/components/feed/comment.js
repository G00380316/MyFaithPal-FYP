import { NotifyCustom } from '@/util/notify';
import { baseUrl, postRequest } from '@/util/service';
import { Favorite, FavoriteBorder } from '@mui/icons-material';
import { Box, CardContent, IconButton, Link, Typography, } from '@mui/joy';
import moment from 'moment';
import { useSession } from 'next-auth/react';
import React, { useState } from 'react';
import { Icons } from 'react-toastify';

export default function Comment({_id,content,likes,user,createdAt}) {
    
    const [isLiked, setLiked] = useState(false);
    const [newCommentInfo, setnewCommentInfo] = useState("");
    const [UserData, setUserData] = useState("");
    const [expanded, setExpanded] = useState(false);
    const contentLengthToShow = 50;
    const { data: session } = useSession();

    const handleLikes = async () => {

        if (!session) {
            NotifyCustom({
                icon: Icons.error,
                text: "Login to Like Comments",
                bar: true,
            })
            return
        };

        if (!isLiked) {

            const newLikesArray = likes.includes(session?.user?._id) ? likes : [...likes, session?.user?._id];

            //console.log(newLikesArray)
            //console.log(_id)
            
            const updatedComment = await postRequest(`${baseUrl}comment/update/like`, JSON.stringify({
                commentId: _id,
                likes: newLikesArray,
            }))

            if (updatedComment?.likes.includes(session?.user?._id)) {
                setLiked(true);
            } else {
                setLiked(false);
            }

            setnewCommentInfo(updatedComment);

            //console.log("Added like to: ", updatedComment);

        } else {

            const newLikesArray = likes.filter(id => id !== session?.user?._id);

            //console.log(newLikesArray)
            //console.log(_id)
            
            const updatedComment = await postRequest(`${baseUrl}comment/update/like`, JSON.stringify({
                commentId: _id,
                likes: newLikesArray,
            }))

            if (updatedComment?.likes.includes(session?.user?._id)) {
                setLiked(true);
            } else {
                setLiked(false);
            }

            setnewCommentInfo(updatedComment);
            
            //console.log("Removed like from: ", updatedComment);
        }
    }

    const toggleExpanded = () => {
        setExpanded(!expanded);
    };

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

                //console.log("Need", userData)
                setUserData(userData || "");
                
            } catch (error) {
                
                console.error('Error getting User Data:', error);
                setError(error.message || 'An error occurred while getting data');

            }
        }

        fetchData();
    }, [user]);

    React.useEffect(() => {
        const checkIFLike = async () => {

            const response = await fetch(`${baseUrl}comment/findById`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ _id }),
            });

            const commentData = await response.json();

            //console.log("need", commentData)

            if (commentData?.likes?.includes(session?.user?._id)) {
                setLiked(true);
                setnewCommentInfo(commentData.likes);
                ////console.log("like set to true")
            } else {
                setLiked(false);
                setnewCommentInfo(commentData.likes);
                ////console.log("like set to false")
            }
        }

        checkIFLike();

    }, []);

    return (
        <Box sx={{ border: "none", borderBottom: "1px solid #ccc", display: 'flex', justifyItems: 'space-between', mb: 1}} >
                <Typography fontSize="sm">
                            <CardContent orientation='vertical'  sx={{justifyContent: "space-between"}}>
                                <Box>
                                    <Link
                                    component="button"
                                    color="neutral"
                                    fontWeight="lg"
                                    textColor="text.primary"
                                    >
                                        {UserData?.user?.username || UserData?.user?.name}
                                    </Link>
                                <Box sx={{width:400, overflowWrap: 'break-word', whiteSpace: 'pre-line'}}>
                                {expanded ? content : content.substring(0, contentLengthToShow)}
                                </Box>
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
                                        </Box>
                                <Box>
                                    <Link
                                        component="button"
                                        underline="none"
                                        fontSize="10px"
                                        sx={{ color: 'text.tertiary' }}
                                        mr={1}
                                    >
                                        {moment(createdAt).calendar()}
                                    </Link>
                                    <Link
                                    component="button"
                                    underline="none"
                                    fontSize="10px"
                                    sx={{ color: 'text.tertiary' }}
                                    >
                                        {newCommentInfo?.length || newCommentInfo?.likes?.length || (!newCommentInfo ? likes.length : 0)} Likes
                                    </Link>
                                </Box>
                            </CardContent>
                </Typography>
                <CardContent sx={{ alignItems: "flex-end" }} >
                        <IconButton variant="plain" color="neutral" size="sm" title='Favourite' onClick={handleLikes}>
                            {isLiked ? <Favorite /> : <FavoriteBorder />}
                        </IconButton>
                </CardContent>
        </Box>
    );
}