"use client"

import * as React from 'react';
import FormControl from '@mui/joy/FormControl';
import { Avatar, Card, CardContent, Button, Typography, Divider, Textarea, ButtonGroup, IconButton  } from '@mui/joy';
import { Fade, Modal, Box, Backdrop } from '@mui/material';
import InputFileUpload from '@/util/buttons/fileUpload';
import { useSession } from 'next-auth/react';
import { emojis } from '@/util/icons/emojis';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: "50%",
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    pt: 2,
    px: 4,
    pb: 3,
    };

export default function createPosts() {

    const [open, setOpen] = React.useState(false);
    const [post, setPost] = React.useState(false);
    const [text, setText] = React.useState('');
    const [showAllEmojis, setShowAllEmojis] = React.useState(false);
    const addEmoji = (emoji) => () => setText(`${text}${emoji}`);
    const handleOpen = () => {
        setTimeout(() => {
            setOpen(true);
        }, 100);
    };
    const handleClose = () => setOpen(false);
    const { data: session } = useSession();

    const handleSubmitPost = () => {

        setPost(true);
        console.log("This is the final Post text: ", text);
        handleClose();

    }

    React.useEffect(() => {
        if (post && text != '') {

            setPost(false);
            setText('');
            
        }
    }, [post]);


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
                                <Typography id="transition-modal-title" variant="h6" component="h2" textAlign={"center"}>
                                Create a Post
                                </Typography>
                    <Divider sx={{border:"0.5px solid"}}/>
                        <Card sx={{ border: "none" }}>
                            <CardContent orientation='horizontal'>
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
                                src={session?.user?.image || ""}
                                sx={{ borderColor: 'background.body' }}
                                    />
                                </Box>
                                <Typography fontWeight="lg" sx={{mt:"3px"}}>{session?.user?.name}</Typography>
                            </CardContent>
                            <Textarea
                            placeholder="What's on your Spirit"
                            value={text}
                            onChange={(event) => setText(event.target.value)}
                            minRows={2}
                            //maxRows={4}
                            startDecorator={
                                    <Box sx={{ display: 'flex', gap: 0.5, flex: 1 }}>
                                        <div style={{ overflowY: 'auto', maxHeight: 25}}>
                                            {emojis.map((emoji, index) => (
                                                <IconButton key={index} variant="outlined" color="neutral" onClick={() => setText(`${text}${emoji}`)}>
                                                    {emoji}
                                                </IconButton>
                                            ))}
                                    </div>
                                    </Box>
                                }
                            endDecorator={
                                <Typography level="body-xs" sx={{ ml: 'auto' }}>
                                {text.length} character(s)
                                </Typography>
                            }
                            sx={{ minWidth: 300 }}
                            />
                        </Card>
                        <Divider sx={{ border: "0.5px solid" }} />
                        <Card orientation= "horizontal" variant="outlined"sx={{border:"none", overflow:"auto"}} >
                            <CardContent sx={{ alignItems: "end"}}>
                                <ButtonGroup color='nuetral'>
                                    <InputFileUpload post={post} text={text}/>
                                <Button type="submit" onClick={handleSubmitPost}>Post</Button>
                                </ButtonGroup>
                            </CardContent>
                        </Card>
                </Box>
                </Fade>
            </Modal>
            <FormControl>
                <Card>
                    <CardContent orientation='horizontal'>
                                <Box
                                sx={{
                                    position: 'relative',
                                    '&::before': {
                                    content: '""',
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    bottom: 7,
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
                                    src={session?.user?.image || ""}
                                    sx={{ borderColor: 'background.body'}}
                                        />
                                </Box>
                        <Button color='Transparent' sx={{
                            minWidth: 400,
                            justifyContent: "start",
                            border: "1px solid",
                            borderColor: "grey",
                            borderRadius: 50,
                            background: ""
                        }}
                        onClick={handleOpen}
                        >
                        <Typography fontFamily="monospace" sx={{ opacity: '50%'}}>
                            What's on your spirit?
                        </Typography>
                        </Button>
                    </CardContent>
                </Card>
            </FormControl>
        </main>
    );
}