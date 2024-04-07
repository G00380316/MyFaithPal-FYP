import {
    AspectRatio, Box, Card, Divider, IconButton,
    Input, Stack, Typography, FormLabel, FormControl,
    CardOverflow, CardActions, Button, Textarea, FormHelperText
    ,styled} from '@mui/joy';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import React from 'react'
import { useSession } from 'next-auth/react';
import EmailRoundedIcon from '@mui/icons-material/EmailRounded';
import { useState, useEffect } from 'react';
import { NotifyCustom } from '@/util/notify';
import { Icons } from 'react-toastify';
import { useRouter } from 'next/navigation';

const VisuallyHiddenInput = styled('input')`
    clip: rect(0 0 0 0);
    clip-path: inset(50%);
    height: 1px;
    overflow: hidden;
    position: absolute;
    bottom: 0;
    left: 0;
    white-space: nowrap;
    width: 1px;
`;

export default function EditProfile() {
    
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [username, setUsername] = useState("");
    const [bio, setBio] = useState("");
    const [file, setFile] = useState(null);
    const [file1, setFile1] = useState(null);
    const [imageSrc, setImageSrc] = useState(null);
    const [coverImageSrc, setCoverImageSrc] = useState(null);
    const [UserData, setUserData] = useState("");
    const [error, setError] = useState("");
    let updatedDetails;
    
    const router = useRouter();
    const { data: session } = useSession();

    const handleFileChange = (e) => {

        setFile(e.target.files[0]);

    }

    const handleFileCoverChange = (e) => {

        setFile1(e.target.files[0]);

    }

    console.log("file for Profile",file)
    console.log("file for Cover", file1)
    
    const handleSave = async (e) => {

        e.preventDefault(e);

        try {

            let newCoverUrl;
            let newProfileUrl;

            if (username != session?.user?.username) {

                const resUsernameExists = await fetch('api/findUsername', {
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ username }),
                });

                const { user } = await resUsernameExists.json();

                if (user) {
                    
                    setError("Username is taken");
                    console.log(error);

                    return;

                }
            }

            if (email != session?.user?.email) {

                const resUserExists = await fetch('api/getUser', {
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ email }),
                });

                const { user } = await resUserExists.json();

                if (user) {
                    
                    setError("Email is taken");
                    console.log(error);

                    return;

                }
            }

            if (file) {
                const formData = new FormData();
                formData.append("file", file);
                
                const response = await fetch('/api/s3-upload', {
                    method: "POST",
                    body: formData,
                });

                const data = await response.json();

                if (data.error) {
                    NotifyCustom({ text: `Click "Save" again to update`, icon: Icons.info , theme: "light"})
                }

                newProfileUrl = data.fileDetails.fileUrl;

            }

            if (file1) {
                let file = file1;
                const formData = new FormData();
                formData.append("file", file);
                
                const response = await fetch('/api/s3-upload', {
                    method: "POST",
                    body: formData,
                });

                const data = await response.json();

                if (data.error) {
                    NotifyCustom({ text: `Click "Save" again to update`, icon: Icons.info , theme: "light"})
                }

                newCoverUrl = data.fileDetails.fileUrl;

            }

            const resUpdatedUser = await fetch('api/updateUser', {
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/json",
                    },
                body: JSON.stringify({
                    email, username, name, image: newProfileUrl, sname: session?.user?.name,
                    semail: session?.user?.email, susername: session?.user?.username,
                    _id: session?.user?._id, simage: session?.user?.image, bio, cimage: newCoverUrl, prevcimage: coverImageSrc}),
            })
            
            updatedDetails = await resUpdatedUser.json();

            if (updatedDetails) {
                console.log("Updated Details info: ", updatedDetails);
                NotifyCustom({ text: "Success Profile Updated", icon: Icons.success, theme: "light" })
                NotifyCustom({ text: "Click to see updates", icon: Icons.info, theme: "light" , onClick:() => window.location.reload()})
            } else {
                console.log("Error updating failed", error);
            }
        } catch (error) {
            console.log("Error whilst Updating: ", error);
        }
    };

    useEffect(() => {
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setImageSrc(reader.result);
            };
            reader.readAsDataURL(file);
        } else {

            setImageSrc(null);

        }
    }, [file]);

    
    useEffect(() => {
        if (file1) {
            const reader = new FileReader();
            reader.onload = () => {
                setCoverImageSrc(reader.result);
            };
            reader.readAsDataURL(file1);
        } else {

            setCoverImageSrc(null);

        }
    }, [file1]);

    useEffect(() => {

        const fetchData = async () => {
            try {

                const response = await fetch(`/api/userByID`, {
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ user: session?.user?._id }),
                });

                const userData = await response.json();

                setUserData(userData || "");
                setBio(userData?.user?.bio || "I love Jesus")
                setCoverImageSrc(userData?.user?.coverimage)

            } catch (error) {
                
                console.error('Error getting User Data:', error);
                setError(error.message || 'An error occurred while getting data');

            }
        }

        fetchData();
    }, [session]);

    const maxCharacters = 275;

    const handleChange = (event) => {
        const inputText = event.target.value;
        if (inputText.length <= maxCharacters) {
            setBio(inputText);
        }
    };

    const charactersLeft = maxCharacters - bio?.length;

    return (
        <Box>
                <Stack
                spacing={4}
                sx={{
                display: 'flex',
                maxWidth: '800px',
                mx: 'auto',
                mb: 13,
                px: { xs: 2, md: 6 },
                py: { xs: 2, md: 3 },
                }}
            >
                <Card>
                <Box sx={{ mb: 1 }}>
                    <Typography level="title-md">Personal info</Typography>
                    <Typography level="body-sm">
                    Customize how your profile information will appear on the app.
                    </Typography>
                </Box>
                <Divider />
                <Stack
                    direction="row"
                    spacing={3}
                    sx={{ display: { xs: 'none', md: 'flex' }, my: 1 }}
                >
                    <Stack direction="column" spacing={1}>
                    <AspectRatio
                        ratio="1"
                        maxHeight={200}
                        sx={{ flex: 1, minWidth: 120, borderRadius: '100%' }}
                    >
                        <img
                        src={imageSrc ||session?.user?.image}
                        srcSet={imageSrc ||session?.user?.image}
                        loading="lazy"
                        alt=""
                        />
                    </AspectRatio>
                    <IconButton
                        aria-label="upload new picture"
                        size="sm"
                        variant="outlined"
                        color="neutral"
                        component="label"
                        role={undefined}
                        sx={{
                        bgcolor: 'background.body',
                        position: 'absolute',
                        zIndex: 2,
                        borderRadius: '50%',
                        left: 100,
                        top: 170,
                        boxShadow: 'sm',
                        }}
                        >
                        <EditRoundedIcon />
                        <VisuallyHiddenInput type="file" accept="image/*" onChange={handleFileChange} />
                    </IconButton>
                    </Stack>
                    <Stack spacing={2} sx={{ flexGrow: 1 }}>
                        <Stack spacing={1}>
                            <FormLabel>Username</FormLabel>
                            <FormControl
                            sx={{ display: { sm: 'flex-column', md: 'flex-row' }, gap: 2 }}
                            >
                                <Input size="sm"
                                        placeholder="Username"
                                        sx={{ flexGrow: 1 }}
                                        value={username}
                                        onChange={(event) => setUsername(event.target.value)}
                                    />
                            </FormControl>
                            <FormLabel>Name</FormLabel>
                            <FormControl
                            sx={{ display: { sm: 'flex-column', md: 'flex-row' }, gap: 2 }}
                            >
                                    <Input
                                        size="sm"
                                        placeholder="Name"
                                        value={name}
                                        onChange={(event) => setName(event.target.value)}
                                    />
                                </FormControl>
                            <FormLabel>Email</FormLabel>
                        <FormControl sx={{ flexGrow: 1 }}>
                        <Input
                            size="sm"
                            type="email"
                            startDecorator={<EmailRoundedIcon />}
                            placeholder="Faithpal@IloveJesus.com"
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            sx={{ flexGrow: 1 }}
                        />
                        </FormControl>
                    </Stack>
                </Stack>
                </Stack>
                </Card>
                
                <Card>
                    <Box sx={{ mb: 1 }}>
                        <Typography level="title-md">Bio</Typography>
                        <Typography level="body-sm">
                        Write a short introduction to be displayed on your profile
                        </Typography>
                    </Box>
                    <Divider />
                    <Stack spacing={2} sx={{ my: 1 }}>
                        <Textarea
                        size="sm"
                        minRows={4}
                        sx={{ mt: 1.5 }}
                        defaultValue={UserData?.user?.bio || "I love Jesus"}
                        value={bio}
                        onChange={handleChange}
                    />
                    <FormHelperText sx={{ mt: 0.75, fontSize: 'xs' }}>
                        {charactersLeft} characters left
                        </FormHelperText>
                        <Divider />
                        <Box sx={{ mb: 1 }}>
                            <Typography level="title-md">Cover Image</Typography>
                            <Typography level="body-sm">
                                Feel free to upload an image that best represents you and your personality for others viewing your profile to get a glimpse of who you are.
                            </Typography>
                        </Box>
                                <Stack
                                    direction="row"
                                    spacing={3}
                                    sx={{ display: { xs: 'none', md: 'flex' }, my: 1 }}
                                >
                                    <Stack direction="column" spacing={1}>
                                        <AspectRatio
                                            ratio="1"
                                            maxHeight={500}
                                            sx={{ flex: 1, width: "670px", position: 'relative' }}
                                        >
                                            <img
                                                src={coverImageSrc || UserData?.user?.coverimage}
                                                srcSet={coverImageSrc || UserData?.user?.coverimage}
                                                loading="lazy"
                                                alt=""
                                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                            />
                                            <IconButton
                                                aria-label="upload new picture"
                                                size="sm"
                                                variant="outlined"
                                                color="neutral"
                                                component="label"
                                                role={undefined}
                                                sx={{
                                                    bgcolor: 'background.body',
                                                    position: 'absolute',
                                                    zIndex: 2,
                                                    borderRadius: '50%',
                                                    right: '0%',
                                                    bottom: '5%',
                                                    transform: 'translate(-50%, 50%)',
                                                    boxShadow: 'sm',
                                                }}
                                            >
                                                <EditRoundedIcon />
                                                <VisuallyHiddenInput type="file" accept="image/*" onChange={handleFileCoverChange} />
                                            </IconButton>
                                        </AspectRatio>
                                    </Stack>
                                </Stack>
                    <CardOverflow sx={{ borderTop: '1px solid', borderColor: 'divider' }}>
                        <CardActions sx={{ alignSelf: 'flex-end', pt: 2 }}>
                            <Button size="sm" variant="solid" onClick={handleSave}>
                                Save
                            </Button>
                        </CardActions>
                    </CardOverflow>
                </Stack>
                </Card>
            </Stack>
        </Box>
    )
}
