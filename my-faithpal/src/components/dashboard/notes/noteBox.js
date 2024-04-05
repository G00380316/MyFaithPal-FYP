import CopyTextButton from '@/util/buttons/copytext';
import { Avatar, Card, CardContent, Divider, Link, Typography } from '@mui/joy';
import {Box} from '@mui/material';
import { useSession } from 'next-auth/react';
import * as React from 'react';
import { useState } from 'react';

export default function NoteCard({note, verse, reference, comment}) {

    const { data: session } = useSession();
    const [expanded, setExpanded] = useState(false);
    const [expanded1, setExpanded1] = useState(false);
    const contentLengthToShow = 50;

    const toggleExpanded = () => {
        setExpanded(!expanded);
    };

    const toggleExpanded1 = () => {
        setExpanded1(!expanded1);
    };

    const listOfTranslations = ['bbe','web','kjv','oeb-cw','oeb-us', 'webbe']
    
    let translation = '';

    listOfTranslations.forEach(translationText => {
        if (reference.includes(translationText)) {
            reference = reference.replace(translationText, '');
            translation += translationText + ' ';
        }
    });

    if (translation.length > 0) {
        translation = translation.charAt(0).toUpperCase() + translation.slice(1);
    }

    return (
        <main>
            <Card
            variant="outlined"
            sx={{
                maxWidth: "100%"
            }}
            >
            <CardContent orientation="horizontal" sx={{ alignItems: 'center', gap: 1 }}>
                <Box
                sx={{
                    position: 'relative',
                    '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                    m: '-2px',
                    borderRadius: '50%',
                    background:
                        'linear-gradient(45deg, #f09433 0%,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888 100%)',
                    },
                }}
                >
                <Avatar
                    size="sm"
                    src={session?.user?.image || ""}
                    sx={{ borderColor: 'background.body' }}
                    />
                    </Box>
                    <Link
                    component="button"
                    color="neutral"
                    fontWeight="lg"
                    textColor="text.primary"
                >
                    {session?.user?.name}
                </Link>
            </CardContent>
                <CardContent >
                        <CardContent orientation='horizontal' sx={{ justifyContent: "space-between" }}>
                            <Typography fontSize="lg" fontWeight={700}>
                                {reference}:{verse}
                        </Typography>
                        <Typography fontSize="lg" fontWeight={700}>
                                {translation.trim() || "Web"}
                        </Typography>
                        </CardContent>
                        <Box sx={{maxWidth:"100%",overflowWrap: 'break-word',whiteSpace: 'pre-line'}}>
                                    {expanded ? note : note?.substring(0, contentLengthToShow)}
                    </Box>
                    <Box display={"flex"} justifyContent={"space-between"}>
                        {note?.length > contentLengthToShow && (
                                <Link
                                    component="button"
                                    underline="none"
                                    fontSize="sm"
                                    startDecorator="…"
                                    sx={{ color: 'text.tertiary' }}
                                    onClick={toggleExpanded}
                                >
                                    {expanded ? "less" : "more"}
                                </Link>
                        )}
                        <CopyTextButton text={`"${note}"\n${reference}:${verse} ${translation.trim()}`}/>
                    </Box>
                    <Divider />
                    <Box display={"flex"} justifyContent={"space-between"}>
                        <Typography fontSize="lg" fontWeight={700}>
                                My Note
                        </Typography>
                    </Box>
                    <Box sx={{maxWidth:"100%",overflowWrap: 'break-word',whiteSpace: 'pre-line'}}>
                                    {expanded1 ? comment : comment?.substring(0, contentLengthToShow)}
                    </Box>
                    <Box display={"flex"} justifyContent={"space-between"}>
                        {comment?.length > contentLengthToShow && (
                                <Link
                                    component="button"
                                    underline="none"
                                    fontSize="sm"
                                    startDecorator="…"
                                    sx={{ color: 'text.tertiary' }}
                                    onClick={toggleExpanded1}
                                >
                                    {expanded1 ? "less" : "more"}
                                </Link>
                        )}
                        <Box/>
                        <CopyTextButton text={`"${note}"\n${reference}:${verse} ${translation.trim()}\n\nComment: ${comment}`}/>
                    </Box>
                </CardContent>
            </Card>
        </main>
        );
    }