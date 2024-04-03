import React from 'react';
import QueryBox  from "@/components/questions/QAcard";
import Grid2 from '@mui/material/Unstable_Grid2/Grid2';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function questions() {
    return (
    <Grid2>
            <QueryBox />
            <ToastContainer/>
    </Grid2>
    )
}
