'use client'
import React from 'react';
import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import { Drawer, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import MenuList from './MenuList';

export function StickyButton() {
    const [open, setOpen] = React.useState(false);
    const toggleDrawer = (newOpen) => () => {
      setOpen(newOpen);
    };

    return (
        <div>
            <Box sx={{ '& > :not(style)': { m: 1 } }} className="w-full flex justify-end sm:mr-[250px] mt-[50px]">
                <Fab variant="extended" color="primary" className='w-[150px] bg-green-700 text-white' onClick={toggleDrawer(true)}
                    style={{
                    position: 'fixed',
                    bottom: '150px',
                    right: '-30px',
                    zIndex: 1000,
                    transform: 'rotate(270deg)',
                    transition: 'transform 0.3s ease-in-out'
                    }}
                >
                    <p className='text-2xl mb-[5px]'>Specials</p>
                </Fab>
            </Box>
            <Drawer open={open} onClose={toggleDrawer(false)} anchor="right" 
                sx={{
                    '& .MuiDrawer-paper': {
                    width: '100%', // Full width
                    height: '100%', // Full height
                    },
                }}
            >
                <Box
                sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', padding: 2 }}
                role="presentation"
                onClick={toggleDrawer(false)}
                onKeyDown={toggleDrawer(false)}
                >
                <IconButton onClick={toggleDrawer(false)}>
                    <CloseIcon />
                </IconButton>
                <MenuList />
                </Box>
            </Drawer>
        </div>
    );
} 