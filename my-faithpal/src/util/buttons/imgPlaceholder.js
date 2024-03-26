import * as React from 'react';
import AspectRatio from '@mui/joy/AspectRatio';
import Card from '@mui/joy/Card';
import CardContent from '@mui/joy/CardContent';
import CardOverflow from '@mui/joy/CardOverflow';
import Typography from '@mui/joy/Typography';

export default function ImageUpLoad({ file }) {
    const [imageSrc, setImageSrc] = React.useState(null);

    React.useEffect(() => {
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setImageSrc(reader.result);
            };
            reader.readAsDataURL(file);
        } else {

            setImageSrc(null);

        }
    }, [file]);

    if (!file) {
        return null;
    }

    return (
        <Card orientation="horizontal" variant="outlined">
            <CardOverflow>
                <AspectRatio ratio="1" sx={{ minWidth: 100, maxWidth:100}}>
                    {imageSrc && (
                        <img
                            src={imageSrc}
                            loading="lazy"
                            alt="Uploaded Image"
                        />
                    )}
                </AspectRatio>
            </CardOverflow>
            <CardContent>
                <Typography fontWeight="md" textColor="success.plainColor">
                    Selected image
                </Typography>
                <Typography level="body-sm">{file?.name}</Typography>
            </CardContent>
        </Card>
    );
}
