"use client"

import { baseUrl, postRequest } from '@/util/service';
import { Grid, Stack } from '@mui/joy';
import { LoadingButton } from '@mui/lab';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import Post from './userPost';

export default function Posts() {
    
        const [PostData, setPostData] = useState([]);
        const [loading, setLoading] = useState(true);
        const [error, setError] = useState(null);
        const { data: session } = useSession();

        useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                const data = await postRequest(`${baseUrl}post/byuserId`, JSON.stringify({
                    userId: session?.user?._id
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
        
        }, [session]);
    
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
        <main style={{ marginBottom: 125 }}>
            <Grid  container direction="row" justifyContent="space-around" alignItems="stretch">
            <Grid>
            </Grid>
                <Grid>
                    <Stack spacing={1} marginTop={1} width={1000}>
                        {PostData?.slice().reverse().map((post) => (
                            <Post
                                key={post._id}
                                _id={post._id}
                                content={post.content}
                                media={post.media}
                                likes={post.likes}
                                saves={post.saves}
                                user={post.user}
                                createdAt={post.createdAt} />
                            ))}
                    </Stack>
                </Grid>
                <Grid>
                </Grid>
            </Grid>
        </main>
    )

}
