"use client"

import { baseUrl, postRequest } from '@/util/service';
import { Grid, Stack } from '@mui/joy';
import { LoadingButton } from '@mui/lab';
import { useEffect, useState } from 'react';
import Post from './peoplePost';

export default function Posts({ personId }) {
    
        const [PostData, setPostData] = useState([]);
        const [loading, setLoading] = useState(true);
        const [error, setError] = useState(null);

        useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                if (!personId) return;

                const data = await postRequest(`${baseUrl}post/byuserId`, JSON.stringify({
                    userId: personId
                }));
                setPostData(data || []);
                console.log("All Posts", data);

            } catch (error) {

                console.error('Error getting Post Data:', error);
                setError(error.message || 'An error occurred while getting data');

            } finally {
                setLoading(false);
            }
        };

        fetchData();
        
        }, [personId]);
    
    if (loading) {
        return <Grid  container direction="row" justifyContent="space-around" alignItems="stretch">
            <Grid>
            </Grid>
                <Grid>
                    <Stack marginTop="35vh" alignItems="center">
                    <LoadingButton loading variant="none" size='large'>
                </LoadingButton>
                    </Stack>
                </Grid>
                <Grid>
            </Grid>
    </Grid>
    }

    if (error) {
        return <p>Error: {error}</p>;
    }
    
    return (
        <Grid container direction="row" alignItems="stretch" spacing={1}>
        {
            personId && PostData ? PostData?.slice().reverse().map((post) => (
                <Grid item xs={12} sm={6} md={4} key={post._id} height={"100"}>
                    <Post
                        _id={post._id}
                        content={post.content}
                        media={post.media}
                        likes={post.likes}
                        saves={post.saves}
                        user={post.user}
                        createdAt={post.createdAt}
                    />
                </Grid>
            )) : null
        }
    </Grid>
    )
}
