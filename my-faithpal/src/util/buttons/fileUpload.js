import * as React from 'react';
import Button from '@mui/joy/Button';
import SvgIcon from '@mui/joy/SvgIcon';
import {Card, CardOverflow, styled } from '@mui/joy';
import ImageUpLoad from './imgPlaceholder';
import { baseUrl, postRequest } from '../service';
import { useSession } from 'next-auth/react';

const VisuallyHiddenInput = styled('input')`
    clip: rect(0 0 0 0);
    clip-path: inset(50%);
    height: 1px;
    overflow: hidden;
    position: absolute;
    bottom: 0;
    left: 0;
    white-space: nowrap;
    width: 1px;
`;

export default function InputFileUpload({ post, text }) {

    const [file, setFile] = React.useState(null);
    const [uploading, setUploading] = React.useState(null);
    const { data: session } = useSession();


    const handleFileChange = (e) => {

        setFile(e.target.files[0]);

    }

    React.useEffect(() => {
        if (post) {

            handleSubmit();

        }
    }, [post]);


    const handleSubmit = async () => {

        if (!file && !text) return;
        
        if (!file) {

            try {

                setUploading(true);

                
                const sendData = await postRequest(`${baseUrl}post/create`, JSON.stringify({
                    user: session?.user?._id,
                    content: text,
                    media: "",
                }))

                setUploading(false);
                window.location.reload();

            } catch (error) {
                
                console.log(error);
                setUploading(false);

            }
        };

        console.log("Passed check there is a file attemping upload: ", file);

        setUploading(true);

        const formData = new FormData();
        formData.append("file", file);

        try {

            const response = await fetch('/api/s3-upload', {
                method: "POST",
                body: formData,
            });

            const data = await response.json();
            console.log(data.fileDetails.fileUrl);

            const sendData = await postRequest(`${baseUrl}post/create`, JSON.stringify({
                user: session?.user?._id,
                content: text ,
                media: data?.fileDetails?.fileUrl,
            }))

            console.log("This was data sent to backend: ",sendData);

            setUploading(false);
            window.location.reload();
            
        } catch (error) {

            console.log(error);
            setUploading(false);

        }
    }

    return (
        <Card orientation= "horizontal" onSubmit={handleSubmit}>
            <CardOverflow>
                <ImageUpLoad file={file} />
            </CardOverflow>
            <Button
                component="label"
                role={undefined}
                tabIndex={-1}
                variant="outlined"
                color="neutral"
                //disabled={!file || uploading}
                startDecorator={
                    <SvgIcon>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                    >
                        <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z"
                        />
                    </svg>
                    </SvgIcon>
                }
                >
                Upload a file
                <VisuallyHiddenInput type="file" accept="image/*" onChange={handleFileChange} />
            </Button>
        </Card>
    );
}
