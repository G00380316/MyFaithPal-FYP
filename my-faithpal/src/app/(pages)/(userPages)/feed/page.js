import React from 'react'
import styles from "@/app/(pages)/(userPages)/feed/feed.module.css";
import { Stack } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2/Grid2';
import CreatePosts from '@/components/feed/createPosts.js';
import Posts from '@/components/feed/posts';

const Styles = {
    root: {
        maxHeight: '90vh',
        overflowY: 'scroll',
        '&::-webkit-scrollbar': {
        width: '0.1em'
        },
        '&::-webkit-scrollbar-thumb': {
        backgroundColor: 'rgba(0,0,0,0.1)',
        borderRadius: '0.25em'
        }
    }
};

export default function feed() {
    return (
    <main className={styles.main}>
        <Grid  container direction="row" justifyContent="space-around" alignItems="stretch">
            <Grid>
            </Grid>
                <Grid>
                    <Stack spacing={1} marginTop={1} maxWidth={500} sx={Styles.root}>
                        <CreatePosts />
                        <Posts/>
                    </Stack>
                </Grid>
                <Grid>
                </Grid>
            </Grid>
    </main>
)
}
