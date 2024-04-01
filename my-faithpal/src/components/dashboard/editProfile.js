import {
    AspectRatio, Box, Card, Divider, IconButton,
    Input, Stack, Typography, FormLabel, FormControl,
    CardOverflow, CardActions, Button, Textarea, FormHelperText
,styled} from '@mui/joy';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import React from 'react'
import { useSession } from 'next-auth/react';
import EmailRoundedIcon from '@mui/icons-material/EmailRounded';
import { useState } from 'react';

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
    const [bio, setBio] = useState("I love Jesus.");
    const [file, setFile] = React.useState(null);
    const [imageSrc, setImageSrc] = React.useState(null);
    const [error, setError] = useState("");

    const { data: session } = useSession();

    const handleFileChange = (e) => {

        setFile(e.target.files[0]);

    }

    console.log(file)
    
    const handleSave = async (e) => {
        
        e.preventDefault();

        try {

            var newProfileUrl;

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
                console.log(data.fileDetails.fileUrl);
                newProfileUrl = data.fileDetails.fileUrl;
            }

            const resUpdatedUser = await fetch('api/updateUser', {
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/json",
                    },
                body: JSON.stringify({
                    email, username, name, image: newProfileUrl, sname: session?.user?.name,
                    semail: session?.user?.email, susername: session?.user?.username,
                    _id: session?.user?._id, simage: session?.user?.image}),
            })
            
            const updatedDetails = await resUpdatedUser.json();

            if (updatedDetails) {
                console.log("Updated Details info: ",updatedDetails);
                //window.location.reload();
            } else {
                console.log("Error updating failed", error);
            }
        } catch (error) {
            console.log("Error whilst Updating: ", error);
        }
    };
    
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
                        src={session?.user?.image || ""}
                        srcSet={session?.user?.image|| ""}
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
                <CardOverflow sx={{ borderTop: '1px solid', borderColor: 'divider' }}>
                    <CardActions sx={{ alignSelf: 'flex-end', pt: 2 }}>
                    <Button size="sm" variant="outlined" color="neutral">
                                Cancel
                    </Button>
                    <Button size="sm" variant="solid" onClick={handleSave}>
                        Save
                    </Button>
                    </CardActions>
                </CardOverflow>
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
                    defaultValue="I Love Jesus."
                    value={bio}
                    onChange={(event) => setBio(event.target.value)}
                    />
                    <FormHelperText sx={{ mt: 0.75, fontSize: 'xs' }}>
                    275 characters left
                    </FormHelperText>
                </Stack>
                <CardOverflow sx={{ borderTop: '1px solid', borderColor: 'divider' }}>
                    <CardActions sx={{ alignSelf: 'flex-end', pt: 2 }}>
                    <Button size="sm" variant="outlined" color="neutral">
                        Cancel
                    </Button>
                    <Button size="sm" variant="solid" onClick={handleSave}>
                        Save
                    </Button>
                    </CardActions>
                </CardOverflow>
                </Card>
            </Stack>
        </Box>
    )
}
