import { baseUrl, postRequest } from '@/util/service';
import { Box, Grid, Stack } from '@mui/joy';
import { LoadingButton } from '@mui/lab';
import { useEffect, useState } from 'react';
import Comment from './comment';

const Styles = {
    root: {
        width: "100%",
        height: '100%',
        borderRadius: '4px',
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

export const CommentList = ({ postId,sentComment }) => {

    const [loading, setLoading] = useState(true);
    const [commentData, setCommentData] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                const data = await postRequest(`${baseUrl}comment/findByPost`, JSON.stringify({
                    post: postId,
                }));

                setCommentData(data || []);
                //console.log("All Comments", data);

            } catch (error) {

                console.error('Error getting Post Data:', error);
                setError(error.message || 'An error occurred while getting data');

            } finally {
                setLoading(false);
            }
        };

            fetchData();
        
    }, [postId,sentComment]);

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
        </Grid>;
    }

    if (error) {
        return <p>Error: {error}</p>;
    }

    return (
            <Box
            sx={Styles.root}>
                <Stack >
                    {commentData.slice().reverse().map((comment, index) => (
                    <Comment
                            key={index}
                            _id={comment._id}
                            content={comment.content}
                            likes={comment.likes}
                            user={comment.user}
                            createdAt={comment.createdAt}
                            postId={comment.post}
                        />))}
                </Stack>
            </Box>
    )
};