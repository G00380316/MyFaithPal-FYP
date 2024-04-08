import {
    AspectRatio, Box, Card,
    CardOverflow,
    Stack, Typography
} from '@mui/joy';
import { useEffect, useState } from 'react';
import Posts from './peoplePosts';

export default function PeopleCards({ user }) {

    const [personId, setPersonId] = useState("");
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [username, setUsername] = useState("");
    const [image, setImage] = useState("");
    const [coverImage, setCoverImage] = useState("");
    const [bio, setBio] = useState("I love Jesus.");

    useEffect(() => {

        ////console.log("This", user)
        setPersonId(user?._id)
        setEmail(user?.email)
        setName(user?.name)
        setUsername(user?.username)
        setCoverImage(user?.coverimage)
        setImage(user?.image)
        setBio(user?.bio)
    
    }, [user]);

    return (
        <Box>
            <Stack
                spacing={4}
                sx={{
                    display: 'flex',
                    maxWidth: '1400px',
                    mx: 'auto',
                    mb: 13,
                    px: { xs: 2, md: 6 },
                    py: { xs: 2, md: 3 },
                }}
            >
                <Card sx={{borderBottom:"10px solid"}}>
                    <CardOverflow sx={{ borderTop: '1px solid', borderColor: 'divider' }}>
                        <Box sx={{ position: 'relative' }}>
                            <AspectRatio ratio="16/8" objectFit="cover">
                                {coverImage ? <img src={coverImage || ""} alt="" loading="lazy" /> : ""}
                            </AspectRatio>
                            <Box
                                sx={{
                                    position: 'absolute',
                                    bottom: '8px',
                                    right: '8px',
                                }}
                            >
                                <img
                                    src={image || ""}
                                    alt=""
                                    loading="lazy"
                                    style={{ width: 240, height: 225, borderRadius: '50%'}}
                                />
                            </Box>
                            <Box
                                sx={{
                                    position: 'absolute',
                                    top: '8px',
                                    left: '8px',
                                }}
                            >
                                <Card sx={{padding:"8px", margin: '5px', background:"rgb(214, 204, 162)"}}>
                                    <Typography level='h1'>{username || ""}</Typography>
                                </Card>
                            </Box>
                        </Box>
                    </CardOverflow>
                    <Box sx={{ mb: 1 }}>
                        <Typography level="title-md">{name}</Typography>
                        <Typography level="body-sm">
                            {bio || ""}
                        </Typography>
                    </Box>
                </Card>
                <Posts personId={personId}/>
            </Stack>
        </Box>
    )
}
