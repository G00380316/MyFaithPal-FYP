import { CommentList } from '@/components/feed/commentList';
import DropdownMenu from '@/util/buttons/postOptions';
import { baseUrl, postRequest } from '@/util/service';
import { Bookmark, Favorite, FavoriteBorder, ModeCommentOutlined, MoreHoriz } from '@mui/icons-material';
import BookmarkBorderRoundedIcon from '@mui/icons-material/BookmarkBorderRounded';
import { AspectRatio, Avatar, Button, Card, CardContent, CardOverflow, Divider, IconButton, Link, Textarea, Typography } from '@mui/joy';
import { Backdrop, Box, Fade, Modal } from '@mui/material';
import moment from 'moment';
import { useSession } from 'next-auth/react';
import * as React from 'react';
import { useState } from 'react';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    maxWidth: "87%",
    maxHeight: "82%",
    overflow: "hidden",
    display: "flex",
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    pt: 2,
    px: 4,
    pb: 3,
};


export default function Post({ _id, content, media, likes, saves, user, createdAt }) {

    const [UserData, setUserData] = useState("");
    const [isLiked, setLiked] = useState(false);
    const [isSaved, setSaved] = useState(false);
    const [isClicked, setClicked] = useState(false);
    const [newSaveInfo, setnewSaveInfo] = useState([]);
    const [newLikeInfo, setnewLikeInfo] = useState([]);
    const { data: session } = useSession();
    const [expanded, setExpanded] = useState(false);
    const [commentData, setCommentData] = useState([]);
    const [isFocused, setIsFocused] = useState(false);
    const [text, setText] = React.useState('');
    const [open, setOpen] = React.useState(false);
    const [error, setError] = useState(null);
    const [sentComment, isCommentSent] = useState(false);
    const contentLengthToShow = 200;

    //Handle functions
    const handleSubmitComment = async () => {

        //console.log("Posting comment:", text);

        const sendData = await postRequest(`${baseUrl}comment/create`, JSON.stringify({
            user: session?.user?._id,
            sendername: session?.user?.username || session?.user?.name,
            senderimage: session?.user?.image,
            content: text,
            post: _id,
        }));

        //console.log("This is what happened",sendData);

        setText('');
        isCommentSent(!sentComment);
    };

    const handleOpen = () => {
        setTimeout(() => {
            setOpen(true);
        }, 100);
    };

    const handleClose = () => setOpen(false);
    
    const toggleExpanded = () => {
        setExpanded(!expanded);
    };

    const handleSelect = (isLiked, newLikeInfo, isSaved, newSaveInfo) => {
        if (isClicked) {

            if (newLikeInfo && newLikeInfo.length != 0) {
                setnewLikeInfo(newLikeInfo);
                setLiked(isLiked);
            }

            if (newSaveInfo  && newSaveInfo.length != 0) {
                setnewSaveInfo(newSaveInfo);
                setSaved(isSaved);
            }

            setClicked(false);

        }
    }

    const handleLikes = async () => {

        if (!isLiked) {

            const newLikesArray = likes.includes(session?.user?._id) ? likes : [...likes, session?.user?._id];

            //console.log(newLikesArray)
            //console.log(_id)
            
            const updatedPost = await postRequest(`${baseUrl}post/update/likes`, JSON.stringify({
                postId: _id,
                likes: newLikesArray,
            }))

            if (updatedPost?.likes.includes(session?.user?._id)) {
                setLiked(true);
            } else {
                setLiked(false);
            }

            setnewLikeInfo(updatedPost?.likes?.length.toString())

            //console.log("Added like to: ", updatedPost);

        } else {

            const newLikesArray = likes.filter(id => id !== session?.user?._id);

            //console.log(newLikesArray)
            //console.log(_id)

            const updatedPost = await postRequest(`${baseUrl}post/update/likes`, JSON.stringify({
                postId: _id,
                likes: newLikesArray,
            }))

            if (updatedPost?.likes.includes(session?.user?._id)) {
                setLiked(true);
            } else {
                setLiked(false);
            }

            setnewLikeInfo(updatedPost?.likes?.length.toString())

            //console.log("Removed like from: ", updatedPost);
        }
    }

    const handleSaves = async () => {
        if (!isSaved) {

            const newSavesArray = saves?.includes(session?.user?._id) ? saves : [...saves, session?.user?._id];

            //console.log(newSavesArray)
            //console.log(_id)
            
            const updatedPost = await postRequest(`${baseUrl}post/update/saves`, JSON.stringify({
                postId: _id,
                saves: newSavesArray,
            }))

            if (updatedPost?.saves.includes(session?.user?._id)) {
                setSaved(true);
            } else {
                setSaved(false);
            }

            setnewSaveInfo(updatedPost?.saves?.length.toString())

            //console.log("Added save to: ", updatedPost);

        } else {

            const newSavesArray = saves.filter(id => id !== session?.user?._id);

            //console.log(newSavesArray)
            //console.log(_id)

            const updatedPost = await postRequest(`${baseUrl}post/update/saves`, JSON.stringify({
                postId: _id,
                saves: newSavesArray,
            }))

            if (updatedPost?.saves.includes(session?.user?._id)) {
                setSaved(true);
            } else {
                setSaved(false);
            }

            setnewSaveInfo(updatedPost?.saves?.length.toString())

            //console.log("Removed save from: ", updatedPost);

        }
    }

    //useEffects
    React.useEffect(() => {
        const fetchData = async () => {
            try {

                const data = await postRequest(`${baseUrl}comment/findByPost`, JSON.stringify({
                    post: _id,
                }));

                setCommentData(data || []);
                //console.log("All Comments", data);

            } catch (error) {

                console.error('Error getting Post Data:', error);
                setError(error.message || 'An error occurred while getting data');

            }
        };

        if (_id) {
            fetchData();
        }
        
    }, [text]);
    
    React.useEffect(() => {
        const checkBtnState = async () => {

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
                setnewLikeInfo(postData?.likes?.length.toString())

            } else {

                setLiked(false);
                setnewLikeInfo(postData?.likes?.length.toString())

            }

            if (postData?.saves?.includes(session?.user?._id)) {

                setSaved(true);
                setnewSaveInfo(postData?.saves?.length.toString())

            } else {

                setSaved(false);
                setnewSaveInfo(postData?.saves?.length.toString())

            }
        }

        checkBtnState();

    }, []);

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

                setUserData(userData || "");
                
            } catch (error) {
                
                console.error('Error getting User Data:', error);
                setError(error.message || 'An error occurred while getting data');

            }
        }

        fetchData();
    }, [user]);

    //console.log("this is new like count", newLikeInfo)
    //console.log("this is new save count", newSaveInfo)

    //no text
    if (!content) {
        return (
            <main>
                <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                open={open}
                onClose={handleClose}
                closeAfterTransition
                slots={{ backdrop: Backdrop }}
                slotProps={{
                backdrop: {
                    timeout: 500,
                },
                }}
            >
                <Fade in={open}>
                        <Box sx={style}>
                                    <CardOverflow>
                                        <AspectRatio ratio="4/3" objectFit="initial" sx={{ minWidth: "90vh"}}>
                                                <img src={media} alt="" loading="lazy" />
                                        </AspectRatio>
                                    </CardOverflow>
                                <Card  size='sm' variant='plain' sx={{ml: 2}}>
                                <Box sx={{maxHeight: "30%"}}>
                                <CardContent orientation="horizontal" sx={{alignItems: 'center', gap: 1 }}>
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
                                            src={UserData?.user?.image || ""}
                                            sx={{ borderColor: 'background.body' }}
                                        />
                                        </Box>
                                            <Typography fontWeight="lg">{UserData?.user?.username || UserData?.user?.name}</Typography>
                                        {session ? (<IconButton variant = "plain" color = "neutral" size = "sm" sx = {{ ml: 'auto' }} onClick={() => setClicked(true)}><DropdownMenu postId={_id} postUser={user} saves={saves} likes={likes} onSelect={handleSelect}/> </IconButton>):
                                        (<>
                                            <IconButton variant = "plain" color = "neutral" size = "sm" sx = {{ ml: 'auto' }}>
                                                <MoreHoriz />
                                            </IconButton>
                                        </>)}
                                        </CardContent>
                                    </Box>
                                    <Divider sx={{ border: "0.1px solid" }} />
                                        <CommentList postId={_id} sentComment={sentComment}/>
                                    <Divider sx={{ border: "0.1px solid" }} />
                                        <Box sx={{border:"none", display: 'flex', justifyItems: 'space-between'}} >
                                                <CardContent orientation="horizontal">
                                                        <IconButton variant="plain" color="neutral" size="sm" title='Favourite' onClick={handleLikes}>
                                                            {isLiked ? <Favorite /> : <FavoriteBorder />}
                                                        </IconButton>
                                                        <IconButton variant="plain" color="neutral" size="sm" title='Bookmark' onClick={handleSaves}>
                                                            {isSaved ? <Bookmark/> : <BookmarkBorderRoundedIcon /> }
                                                        </IconButton>
                                                </CardContent>
                                                <CardContent sx={{alignItems:"flex-end"}} >
                                                    <Link
                                                            component="button"
                                                            underline="none"
                                                            fontSize="sm"
                                                            fontWeight="lg"
                                                            textColor="text.primary"
                                                        >
                                                            {newLikeInfo} Likes
                                                        </Link>
                                                        <Link
                                                            component="button"
                                                            underline="none"
                                                            fontSize="10px"
                                                            sx={{ color: 'text.tertiary'}}
                                                        >
                                                            {moment(createdAt).calendar()}
                                                        </Link>
                                                </CardContent>
                                        </Box>
                                    <Divider sx={{ border: "0.1px solid" }} />
                                    <Box sx={{display: "flex"}}>
                                    <Textarea
                                        placeholder="Add a comment"
                                        value={text}
                                        maxRows="2"
                                        onChange={(event) => setText(event.target.value)}
                                        onFocus={() => setIsFocused(true)}
                                        onBlur={() => setIsFocused(false)}
                                        sx={{ width: 350, borderColor: isFocused ? 'primary.main' : undefined}}
                                    />
                                    <Button
                                        onClick={handleSubmitComment}
                                        variant="contained"
                                        color="primary"
                                        sx={{ backgroundColor: isFocused ? 'primary.main' : 'primary.light', '&:hover': { backgroundColor: 'primary.main' } }}
                                        disabled={!isFocused && !text.trim()}
                                    >
                                        Post
                                    </Button>
                                </Box>
                        </Card>
                    </Box>
                </Fade>
            </Modal>
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
                        src={UserData?.user?.image || ""}
                        sx={{ borderColor: 'background.body' }}
                    />
                    </Box>
                        <Typography fontWeight="lg">{UserData?.user?.username || UserData?.user?.name}</Typography>
                    {session ? (<IconButton variant = "plain" color = "neutral" size = "sm" sx = {{ ml: 'auto' }} onClick={() => setClicked(true)}><DropdownMenu postId={_id} postUser={user} saves={saves} likes={likes} onSelect={handleSelect}/> </IconButton>):
                    (<>
                        <IconButton variant = "plain" color = "neutral" size = "sm" sx = {{ ml: 'auto' }}>
                            <MoreHoriz />
                        </IconButton>
                    </>)}
                </CardContent>
                <CardOverflow>
                    <AspectRatio ratio="1" objectFit="contain">
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
                                    {UserData?.user?.username || UserData?.user?.name}
                                </Link>
                                {/*<Link
                                    component="button"
                                    underline="none"
                                    fontSize="sm"
                                    fontWeight="lg"
                                    textColor="text.primary"
                                >
                                    {newLikeInfo} Likes
                                </Link>*/}
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
                            <Link
                                    component="button"
                                    fontSize="10px"
                                onClick={handleOpen}
                                    sx={{ color: 'text.tertiary', my: 0.5 }}
                                >
                                    {commentData?.length || 0} comments
                                </Link>
                        </CardContent>
                </CardContent>
                <Divider/>
                <CardContent orientation="horizontal" sx={{ display: 'flex', justifyContent: 'space-around'}}>
                    <IconButton variant="plain" color="neutral" size="sm" title='Favourite' onClick={handleLikes}>
                            {isLiked ? <Favorite /> : <FavoriteBorder />}
                            {newLikeInfo === "0" ? "" : newLikeInfo}
                    </IconButton>
                    <IconButton variant="plain" color="neutral" size="sm" title='Comment' onClick={handleOpen}>
                        <ModeCommentOutlined />
                    </IconButton>
                    <IconButton variant="plain" color="neutral" size="sm" title='Bookmark' onClick={handleSaves}>
                            {isSaved ? <Bookmark /> : <BookmarkBorderRoundedIcon />}
                            {newSaveInfo === "0" ? "" : newSaveInfo}
                    </IconButton>
                </CardContent>
            </Card>
        </main>
        );
    }
    
    //no image
    if (!media) {
        return (
        <main>
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                open={open}
                onClose={handleClose}
                closeAfterTransition
                slots={{ backdrop: Backdrop }}
                slotProps={{
                backdrop: {
                    timeout: 500,
                },
                }}
            >
                <Fade in={open}>
                        <Box height="100%"sx={style}>
                                <Card  size='lg' variant='plain' sx={{ml: 2}}>
                                <Box sx={{maxHeight: "30%"}}>
                                <CardContent orientation="horizontal" sx={{alignItems: 'center', gap: 1 }}>
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
                                                src={UserData?.user?.image || ""}
                                                sx={{ borderColor: 'background.body' }}
                                            />
                                            </Box>
                                                <Typography fontWeight="lg">{UserData?.user?.username || UserData?.user?.name}</Typography>
                                            {session ? (<IconButton variant = "plain" color = "neutral" size = "sm" sx = {{ ml: 'auto' }} onClick={() => setClicked(true)}><DropdownMenu postId={_id} postUser={user} saves={saves} likes={likes} onSelect={handleSelect}/> </IconButton>):
                                            (<>
                                                <IconButton variant = "plain" color = "neutral" size = "sm" sx = {{ ml: 'auto' }}>
                                                    <MoreHoriz />
                                                </IconButton>
                                            </>)}
                                    </CardContent>
                                    </Box>
                                <Divider sx={{ border: "0.1px solid" }} />
                                <Box sx={{ width: 400, overflowWrap: 'break-word', whiteSpace: 'pre-line'/*, alignSelf: "center" */ }}>
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
                                <Divider sx={{ border: "0.1px solid" }} />
                                        <CommentList postId={_id} sentComment={sentComment}/>
                                    <Divider sx={{ border: "0.1px solid" }} />
                                        <Box sx={{border:"none", display: 'flex', justifyItems: 'space-between'}} >
                                                <CardContent orientation="horizontal">
                                                        <IconButton variant="plain" color="neutral" size="sm" title='Favourite' onClick={handleLikes}>
                                                            {isLiked ? <Favorite /> : <FavoriteBorder />}
                                                        </IconButton>
                                                        <IconButton variant="plain" color="neutral" size="sm" title='Bookmark' onClick={handleSaves}>
                                                            {isSaved ? <Bookmark/> : <BookmarkBorderRoundedIcon /> }
                                                        </IconButton>
                                                </CardContent>
                                                <CardContent sx={{alignItems:"flex-end"}} >
                                                    <Link
                                                            component="button"
                                                            underline="none"
                                                            fontSize="sm"
                                                            fontWeight="lg"
                                                            textColor="text.primary"
                                                        >
                                                            {newLikeInfo} Likes
                                                        </Link>
                                                        <Link
                                                            component="button"
                                                            underline="none"
                                                            fontSize="10px"
                                                            sx={{ color: 'text.tertiary'}}
                                                        >
                                                            {moment(createdAt).calendar()}
                                                        </Link>
                                                </CardContent>
                                        </Box>
                                    <Divider sx={{ border: "0.1px solid" }} />
                                    <Box sx={{display: "flex"}}>
                                    <Textarea
                                        placeholder="Add a comment"
                                        value={text}
                                        maxRows="2"
                                        onChange={(event) => setText(event.target.value)}
                                        onFocus={() => setIsFocused(true)}
                                        onBlur={() => setIsFocused(false)}
                                        sx={{ width: 350, borderColor: isFocused ? 'primary.main' : undefined}}
                                    />
                                    <Button
                                        onClick={handleSubmitComment}
                                        variant="contained"
                                        color="primary"
                                        sx={{ backgroundColor: isFocused ? 'primary.main' : 'primary.light', '&:hover': { backgroundColor: 'primary.main' } }}
                                        disabled={!isFocused && !text.trim()}
                                    >
                                        Post
                                    </Button>
                                </Box>
                        </Card>
                    </Box>
                </Fade>
            </Modal>
            <Card
            variant="outlined"
            sx={{
                maxWidth: "100%"
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
                    src={UserData?.user?.image || ""}
                    sx={{ borderColor: 'background.body' }}
                />
                </Box>
                    <Typography fontWeight="lg">{UserData?.user?.username || UserData?.user?.name}</Typography>
                {session ? (<IconButton variant = "plain" color = "neutral" size = "sm" sx = {{ ml: 'auto' }} onClick={() => setClicked(true)}><DropdownMenu postId={_id} postUser={user} saves={saves} likes={likes} onSelect={handleSelect}/> </IconButton>):
                (<>
                    <IconButton variant = "plain" color = "neutral" size = "sm" sx = {{ ml: 'auto' }}>
                        <MoreHoriz />
                    </IconButton>
                </>)}
            </CardContent>
                <CardContent >
                        <CardContent orientation='horizontal' sx={{ justifyContent: "space-between" }}>
                            <Typography fontSize="sm">
                                <Link
                                    component="button"
                                    color="neutral"
                                    fontWeight="lg"
                                    textColor="text.primary"
                                >
                                    {UserData?.user?.username || UserData?.user?.name}
                                </Link>{' '}
                            </Typography>
                                {/*<Link
                                    component="button"
                                    underline="none"
                                    fontSize="sm"
                                    fontWeight="lg"
                                    textColor="text.primary"
                                >
                                    {newLikeInfo} Likes
                                </Link>*/}
                        </CardContent>
                        <Box sx={{maxWidth:"100%",overflowWrap: 'break-word',whiteSpace: 'pre-line'}}>
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
                    <CardContent orientation='horizontal' sx={{ justifyContent: "space-between" }}>
                            <Link
                                component="button"
                                underline="none"
                                fontSize="10px"
                                sx={{ color: 'text.tertiary', my: 0.5 }}
                            >
                                {moment(createdAt).calendar()}
                            </Link>
                            <Link
                                    component="button"
                                    fontSize="10px"
                                onClick={handleOpen}
                                    sx={{ color: 'text.tertiary', my: 0.5 }}
                                >
                                    {commentData?.length || 0} comments
                                </Link>
                    </CardContent>
                </CardContent>
            <Divider/>
            <CardContent orientation="horizontal" sx={{ display: 'flex', justifyContent: 'space-around'}}>
                <IconButton variant="plain" color="neutral" size="sm" title='Favourite' onClick={handleLikes}>
                            {isLiked ? <Favorite /> : <FavoriteBorder />}
                            {newLikeInfo === "0" ? "" : newLikeInfo}
                </IconButton>
                <IconButton variant="plain" color="neutral" size="sm" title='Comment' onClick={handleOpen}>
                        <ModeCommentOutlined />
                </IconButton>
                <IconButton variant="plain" color="neutral" size="sm" title='Bookmark' onClick={handleSaves}>
                            {isSaved ? <Bookmark /> : <BookmarkBorderRoundedIcon />}
                            {newSaveInfo === "0" ? "" : newSaveInfo}
                </IconButton>
            </CardContent>
            </Card>
        </main>
        );
    }
    
    //Default behaviour
    return (
        <main>
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                open={open}
                onClose={handleClose}
                closeAfterTransition
                slots={{ backdrop: Backdrop }}
                slotProps={{
                backdrop: {
                    timeout: 500,
                },
                }}
            >
                <Fade in={open}>
                        <Box sx={style}>
                                    <CardOverflow>
                                        <AspectRatio ratio="4/3" objectFit="initial" sx={{ minWidth: "100vh"}}>
                                                <img src={media} alt="" loading="lazy" />
                                        </AspectRatio>
                                    </CardOverflow>
                                <Card  size='sm' variant='plain' sx={{ml: 2}}>
                                <Box sx={{maxHeight: "30%"}}>
                                <CardContent orientation="horizontal" sx={{alignItems: 'center', gap: 1 }}>
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
                                            src={UserData?.user?.image || ""}
                                            sx={{ borderColor: 'background.body' }}
                                        />
                                        </Box>
                                            <Typography fontWeight="lg">{UserData?.user?.username || UserData?.user?.name}</Typography>
                                        {session ? (<IconButton variant = "plain" color = "neutral" size = "sm" sx = {{ ml: 'auto' }} onClick={() => setClicked(true)}><DropdownMenu postId={_id} postUser={user} saves={saves} likes={likes} onSelect={handleSelect}/> </IconButton>):
                                        (<>
                                            <IconButton variant = "plain" color = "neutral" size = "sm" sx = {{ ml: 'auto' }}>
                                                <MoreHoriz />
                                            </IconButton>
                                        </>)}
                                        </CardContent>
                                    </Box>
                                    <Divider sx={{ border: "0.1px solid" }} />
                                    <Box sx={{ width: 400, overflowWrap: 'break-word', whiteSpace: 'pre-line'/*, alignSelf: "center" */}}>
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
                                <Divider sx={{ border: "0.1px solid" }} />
                                            <CommentList postId={_id} sentComment={sentComment}/>
                                        <Divider sx={{ border: "0.1px solid" }} />
                                            <Box sx={{border:"none", display: 'flex', justifyItems: 'space-between'}} >
                                                    <CardContent orientation="horizontal">
                                                            <IconButton variant="plain" color="neutral" size="sm" title='Favourite' onClick={handleLikes}>
                                                                {isLiked ? <Favorite /> : <FavoriteBorder />}
                                                            </IconButton>
                                                            <IconButton variant="plain" color="neutral" size="sm" title='Bookmark' onClick={handleSaves}>
                                                                {isSaved ? <Bookmark/> : <BookmarkBorderRoundedIcon /> }
                                                            </IconButton>
                                                    </CardContent>
                                                    <CardContent sx={{alignItems:"flex-end"}} >
                                                        <Link
                                                                component="button"
                                                                underline="none"
                                                                fontSize="sm"
                                                                fontWeight="lg"
                                                                textColor="text.primary"
                                                            >
                                                                {newLikeInfo} Likes
                                                            </Link>
                                                            <Link
                                                                component="button"
                                                                underline="none"
                                                                fontSize="10px"
                                                                sx={{ color: 'text.tertiary'}}
                                                            >
                                                                {moment(createdAt).calendar()}
                                                            </Link>
                                                    </CardContent>
                                            </Box>
                                        <Divider sx={{ border: "0.1px solid" }} />
                                        <Box sx={{display: "flex"}}>
                                        <Textarea
                                            placeholder="Add a comment"
                                            value={text}
                                            maxRows="2"
                                            onChange={(event) => setText(event.target.value)}
                                            onFocus={() => setIsFocused(true)}
                                            onBlur={() => setIsFocused(false)}
                                            sx={{ width: 350, borderColor: isFocused ? 'primary.main' : undefined}}
                                        />
                                        <Button
                                            onClick={handleSubmitComment}
                                            variant="contained"
                                            color="primary"
                                            sx={{ backgroundColor: isFocused ? 'primary.main' : 'primary.light', '&:hover': { backgroundColor: 'primary.main' } }}
                                            disabled={!isFocused && !text.trim()}
                                        >
                                            Post
                                        </Button>
                                    </Box>
                                </Card>
                            </Box>
                        </Fade>
                </Modal>
                <Card
            variant="outlined"
            sx={{
                maxWidth: "100%"
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
                    src={UserData?.user?.image || ""}
                    sx={{ borderColor: 'background.body' }}
                />
                </Box>
                    <Typography fontWeight="lg">{UserData?.user?.username || UserData?.user?.name}</Typography>
                {session ? (<IconButton variant = "plain" color = "neutral" size = "sm" sx = {{ ml: 'auto' }} onClick={() => setClicked(true)}><DropdownMenu postId={_id} postUser={user} saves={saves} likes={likes} onSelect={handleSelect}/> </IconButton>):
                (<>
                    <IconButton variant = "plain" color = "neutral" size = "sm" sx = {{ ml: 'auto' }}>
                        <MoreHoriz />
                    </IconButton>
                </>)}
                    </CardContent>
                    <CardOverflow>
                    <AspectRatio ratio="1" objectFit="contain">
                            <img src={media} alt="" loading="lazy" />
                    </AspectRatio>
                    </CardOverflow>
                <CardContent >
                        <CardContent orientation='horizontal' sx={{ justifyContent: "space-between" }}>
                            <Typography fontSize="sm">
                                <Link
                                    component="button"
                                    color="neutral"
                                    fontWeight="lg"
                                    textColor="text.primary"
                                >
                                    {UserData?.user?.username || UserData?.user?.name}
                                </Link>{' '}
                            </Typography>
                                {/*<Link
                                    component="button"
                                    underline="none"
                                    fontSize="sm"
                                    fontWeight="lg"
                                    textColor="text.primary"
                                >
                                    {newLikeInfo} Likes
                            </Link>*/}
                        </CardContent>
                        <Box sx={{maxWidth:"100%",overflowWrap: 'break-word',whiteSpace: 'pre-line'}}>
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
                <CardContent orientation='horizontal' sx={{ justifyContent: "space-between" }}>
                            <Link
                                component="button"
                                underline="none"
                                fontSize="10px"
                                sx={{ color: 'text.tertiary', my: 0.5 }}
                            >
                                {moment(createdAt).calendar()}
                            </Link>
                            <Link
                                    component="button"
                                    fontSize="10px"
                                onClick={handleOpen}
                                    sx={{ color: 'text.tertiary', my: 0.5 }}
                                >
                                    {commentData?.length || 0} comments
                                </Link>
                </CardContent>
            </CardContent>
            <Divider/>
            <CardContent orientation="horizontal" sx={{ display: 'flex', justifyContent: 'space-around'}}>
                <IconButton variant="plain" color="neutral" size="sm" title='Favourite' onClick={handleLikes}>
                        {isLiked ? <Favorite /> : <FavoriteBorder />}
                        {newLikeInfo === "0" ? "" : newLikeInfo}
                </IconButton>
                <IconButton variant="plain" color="neutral" size="sm" title='Comment' onClick={handleOpen}>
                        <ModeCommentOutlined />
                </IconButton>
                <IconButton variant="plain" color="neutral" size="sm" title='Bookmark' onClick={handleSaves}>
                        {isSaved ? <Bookmark /> : <BookmarkBorderRoundedIcon />}
                        {newSaveInfo === "0" ? "" : newSaveInfo}
                    </IconButton>
            </CardContent>
            </Card>
        </main>
    );
}