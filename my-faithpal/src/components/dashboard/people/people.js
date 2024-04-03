"use client"

import { baseUrl, postRequest } from '@/util/service';
import { Grid, Stack } from '@mui/joy';
import { LoadingButton } from '@mui/lab';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import PotentialChats from './search';

export default function People() {
    
        const [loading, setLoading] = useState(false);
        const [error, setError] = useState(null);
        const { data: session } = useSession();
    
    if (loading) {
        return <Grid  container direction="row" justifyContent="space-around" alignItems="stretch">
            <Grid>
            </Grid>
                <Grid>
                    <Stack marginTop="35vh" alignItems="center" padding={"5px"}>
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
                        <PotentialChats/>
                    </Stack>
                </Grid>
                <Grid>
                </Grid>
            </Grid>
        </main>
    )

}
