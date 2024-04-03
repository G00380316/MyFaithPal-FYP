import React, { useState, useRef, useEffect } from 'react';
import { IconButton, Menu, MenuItem } from '@mui/material';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { useSession } from 'next-auth/react';


const DropdownMenu = () => {

    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedIndex, setSelectedIndex] = useState(0); // Initial selected index
    const menuRef = useRef(null);
    const { data: session } = useSession();
    
    const handleOpenMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleCloseMenu = () => {
        setAnchorEl(null);
    };

    const handleMenuItemClick = (event, index) => {
        setSelectedIndex(index);
        handleCloseMenu();
        // Perform any action you want with the selected index or option
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

    const options = ['Delete', 'Like', 'Save', 'Edit'];

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
