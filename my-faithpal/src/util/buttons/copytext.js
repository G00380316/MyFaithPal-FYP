import { useState } from 'react';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import { IconButton } from '@mui/joy';

const CopyTextButton = ({ text }) => {
    const [copied, setCopied] = useState(false);

    const copyToClipboard = async () => {
        try {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        } catch (err) {
        console.error('Failed to copy text: ', err);
        }
    };

    return (
        <div>
        <IconButton onClick={copyToClipboard}>
            <FileCopyIcon/>
            {copied ? 'Copied!' : 'Copy Text'}
        </IconButton>
        </div>
    );
};

export default CopyTextButton;
