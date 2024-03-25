import React from 'react'
import { Stack, Card } from '@mui/joy';
import Post from './post';

export default function Posts() {
    
    return (
        <Stack mar spacing={1} >
            <Post />
            
            <Card
            color="neutral"
            invertedColors
            orientation="vertical"
            size="lg"
            variant="solid" />
            
            <Card
            color="neutral"
            invertedColors
            orientation="vertical"
            size="lg"
            variant="solid"/>
        </Stack>
    )

}
