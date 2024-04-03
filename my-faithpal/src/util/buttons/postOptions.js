import React, { useState, useRef, useEffect } from 'react';
import { IconButton, Menu, MenuItem } from '@mui/material';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { useSession } from 'next-auth/react';
import { baseUrl, postRequest } from '../service';


const DropdownMenu = ({postId, postUser, saves, likes, onSelect}) => {

    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedIndex, setSelectedIndex] = useState(0); // Initial selected index
    const [newSaveInfo, setnewSaveInfo] = useState([]);
    const [newLikeInfo, setnewLikeInfo] = useState([]);
    const [isLiked, setLiked] = useState(false);
    const [isSaved, setSaved] = useState(false);
    const menuRef = useRef(null);
    const { data: session } = useSession();
    let options;

    const handleOpenMenu = async (event) => {
        setAnchorEl(event.currentTarget);
        
        const response = await fetch(`${baseUrl}post/byId`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ postId }),
        });

        const postData = await response.json();

        if (postData?.likes?.includes(session?.user?._id)) {
            
            setLiked(true);
            setnewLikeInfo(postData?.likes?.length.toString())

        } else {

            setLiked(false);

            setnewLikeInfo(postData?.likes?.length.toString())
        }

        if (postData?.saves?.includes(session?.user?._id)) {
            setSaved(true);

            setnewSaveInfo(postData?.saves?.length.toString())

        } else {

            setSaved(false);

            setnewSaveInfo(postData?.saves?.length.toString())
        }
    };

    const handleCloseMenu = () => {
        setAnchorEl(null);
    };

    const handleMenuItemClick = async (event, index) => {
        setSelectedIndex(index);
        handleCloseMenu();
        
        console.log(index);

        try {

            //Like
            if (index == 0) {

                    if (!isLiked) {
                        
                    const newLikesArray = likes?.includes(session?.user?._id) ? likes : [...likes, session?.user?._id];
                    
                    const updatedPost = await postRequest(`${baseUrl}post/update/likes`, JSON.stringify({
                        postId,
                        likes: newLikesArray,
                    }))

                    if (updatedPost?.likes.includes(session?.user?._id)) {
                        setLiked(true);
                    } else {
                        setLiked(false);
                    }

                    setnewLikeInfo(updatedPost?.likes?.length.toString())

                    console.log("Added like to: ", updatedPost);

                } else {

                    const newLikesArray = likes.filter(id => id !== session?.user?._id);

                    console.log(newLikesArray)

                    const updatedPost = await postRequest(`${baseUrl}post/update/likes`, JSON.stringify({
                        postId,
                        likes: newLikesArray,
                    }))

                    if (updatedPost?.likes.includes(session?.user?._id)) {
                        setLiked(true);
                    } else {
                        setLiked(false);
                    }

                    setnewLikeInfo(updatedPost?.likes?.length.toString())

                    console.log("Removed like from: ", updatedPost);
                    
                }
            }

            //Save
            if (index == 1) {
                
                if (!isSaved) {

                const newSavesArray = saves?.includes(session?.user?._id) ? saves : [...saves, session?.user?._id];

                console.log(newSavesArray)
                
                const updatedPost = await postRequest(`${baseUrl}post/update/saves`, JSON.stringify({
                    postId,
                    saves: newSavesArray,
                }))

                if (updatedPost?.saves.includes(session?.user?._id)) {
                    setSaved(true);
                } else {
                    setSaved(false);
                }

                setnewSaveInfo(updatedPost?.saves?.length.toString())

            } else {

                    const newSavesArray = saves.filter(id => id !== session?.user?._id);

                    console.log(newSavesArray)

                    const updatedPost = await postRequest(`${baseUrl}post/update/saves`, JSON.stringify({
                        postId,
                        saves: newSavesArray,
                    }))

                    if (updatedPost?.saves.includes(session?.user?._id)) {
                        setSaved(true);
                    } else {
                        setSaved(false);
                    }

                    setnewSaveInfo(updatedPost?.saves?.length.toString())

                    console.log("Removed save from: ", updatedPost);

                }
            }

            //Delete
            if (index == 2) {

                console.log("delete");

                const deletedPost = await postRequest(`${baseUrl}post/delete`,
                    JSON.stringify({ postId })
                );

                if (deletedPost) {
                    window.location.reload();
                }
            }

            /*Edit
            if (index == 3) {
                
            }*/
        } catch (error) {
            console.log(error)
        }
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                handleCloseMenu();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    
    useEffect(() => {
        onSelect(isLiked ,newLikeInfo, isSaved, newSaveInfo);
    }, [isLiked, newLikeInfo, isSaved, newSaveInfo]);

    let value0
    let value1

    if (session.user._id !== postUser) {

        if (!isLiked) {
            value0 = `Like`
        } else {
            value0 = `Unlike`
        }

        if (!isSaved) {
            value1 = `Save`
        } else {
            value1 = `Remove Save`
        }

        options = [value0, value1];

    } else {

        if (!isLiked) {
            value0 = `Like`
        } else {
            value0 = `Unlike`
        }

        if (!isSaved) {
            value1 = `Save`
        } else {
            value1 = `Remove Save`
        }

        options = [value0, value1, 'Delete'/*, 'Edit'*/];

    }

    return (
        <>
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleCloseMenu}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                ref={menuRef}
            >
                {options.map((option, index) => (
                    <MenuItem
                        key={option}
                        selected={index === selectedIndex}
                        onClick={(event) => handleMenuItemClick(event, index)}
                        dense
                    >
                        {option}
                    </MenuItem>
                ))}
            </Menu>
            <IconButton
                variant="plain"
                color="inherit"
                size="small"
                onClick={handleOpenMenu}
                aria-controls="menu"
                aria-haspopup="true"
                sx={{ ml: 'auto' }}
            >
                <MoreHorizIcon />
            </IconButton>
        </>
    );
};

export default DropdownMenu;
