import React from 'react'
import styles from "@/app/(pages)/(userPages)/feed/feed.module.css";
import { Stack } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2/Grid2';
import Card from '@mui/joy/Card';
import CreatePosts from '@/components/feed/createPosts.js';
import Posts from '@/components/feed/posts';

export default function feed() {
    return (
    <main className={styles.main}>
        <Grid  container direction="row" justifyContent="space-around" alignItems="stretch">
            <Grid>
                <Stack>
                    <Card
                    color="warning"
                    invertedColors
                    orientation="vertical"
                    size="lg"
                    variant="solid"/>
                </Stack>
            </Grid>
                <Grid>
                    <Stack spacing={1} marginTop={1} >
                        <CreatePosts />
                        <Posts/>
                    </Stack>
                </Grid>
                <Grid>
                    <Stack>
                        <Card
                        color="success"
                        invertedColors
                        orientation="vertical"
                        size="lg"
                        variant="solid"/>
                    </Stack>
                </Grid>
            </Grid>
    </main>
)
}
