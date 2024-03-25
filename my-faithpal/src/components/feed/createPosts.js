"use client"

import * as React from 'react';
import FormControl from '@mui/joy/FormControl';
import Textarea from '@mui/joy/Textarea';
import { Avatar, Card, CardContent , Button, Typography} from '@mui/joy';

export default function createPosts() {
    return (
        <main>
            <FormControl>
                <Card>
                    <CardContent orientation='horizontal'>
                        <Avatar
                        size="sm"
                        src="avatar.png"
                        sx={{ p: 0.5, border: '2px solid', borderColor: 'background.body' }}
                        />
                        <Button color='Transparent' sx={{
                            minWidth: 400,
                            justifyContent: "start",
                            border: "1px solid",
                            borderColor: "grey",
                            borderRadius: 50,
                            background: ""
                        }}
                        onClick={{}}
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