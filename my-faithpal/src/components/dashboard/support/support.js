
import { Box, Card, Divider, Typography } from '@mui/joy';
import React from 'react'

export default function Support() {
    
    return (
        <Box m>
            <Card>
                <Box sx={{ m: 2 }}>
                    <Typography
                        fontSize="24px"
                        fontStyle="italic"
                        fontFamily="monospace"
                        level="title-lg"
                        fontWeight={900}
                    >
                        Info & Instructions
                    </Typography>
                <Typography level="sm">
                Write a short introduction to be displayed on your profile
                </Typography>
        </Box>
                <Divider />
                <Box m={2}>
                    <Typography level="h4">
                    Heading 1
                    </Typography>
                    <Typography level="body-sm">
                        Write a short introduction to be displayed on your profile
                    </Typography>
                    <Typography level="h4">
                    Heading 2
                    </Typography>
                    <Typography level="body-sm">
                        Write a short introduction to be displayed on your profile
                    </Typography>
                    <Typography level="h4">
                    Heading 3
                    </Typography>
                    <Typography level="body-sm">
                        Write a short introduction to be displayed on your profile
                    </Typography>
                    <Typography level="h4">
                    Heading 4
                    </Typography>
                    <Typography level="body-sm">
                        Write a short introduction to be displayed on your profile
                    </Typography>
                    <Typography level="h4">
                    Heading 5
                    </Typography>
                    <Typography level="body-sm">
                        Write a short introduction to be displayed on your profile
                    </Typography>
                    <Typography level="h4">
                    Heading 6
                    </Typography>
                    <Typography level="body-sm">
                        Write a short introduction to be displayed on your profile
                    </Typography>
                </Box>
            </Card>
        </Box>
    )
}
