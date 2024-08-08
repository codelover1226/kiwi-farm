'use client'
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Card,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import { Drawer, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import MenuList from './MenuList';

export default function ProductPage() {
  const [open, setOpen] = React.useState(false);
  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };
  
  const categories = [
    {
      title: 'flower',
      image: '/flower.jpg',
    },
    {
      title: 'edibles',
      image: '/kiwi_farms_edibles.jpg',
    },
    {
      title: 'concentrates',
      image: '/kiwi_farms_extracts.jpg',
    },
    {
      title: 'pre-rolls',
      image: '/kiwi_canna_prerolls.jpg',
    },
    {
      title: 'miscellaneous',
      image: '/kiwi_canna_prerolls.jpg',
    },
  ];

  const categoriesRender = [];
  categories.forEach((category, i) => {
    categoriesRender.push(
      <Link href={category.title}>
        <Card
          className='max-w-sm h-[28rem] rounded overflow-hidden shadow-lg p-2 hover:bg-accent'
          key={i}>
          <CardHeader>
            <Image
              className='w-full bg-white aspect-square rounded object-cover'
              src={category.image}
              alt='category'
              width={300}
              height={300}
            />
            <CardTitle className='text-2xl font-normal text-center capitalize'>
              {category.title}
            </CardTitle>
          </CardHeader>
        </Card>
      </Link>,
    );
  });

  return (
  <div>
    {/* {!isVisitor ? */}
      <div className='flex min-h-screen flex-col items-center justify-between py-10'>
        <div className='p-10'>
          <Image
            src='/kiwi_logo.jpg'
            alt='Kiwi Farms - Premium Cannabis'
            width={350}
            height={350}
            className='rounded'
          />
        </div>
  
        <h1 className='text-2xl pb-6'>Nothing For Sale</h1>
  
        <h2 className='text-lg pb-8'>Educational Purposes Only</h2>
  
        <h2 className='text-lg pb-10'>(Click Image For More Details)</h2>
  
        <div className='flex flex-row flex-wrap gap-6 justify-center m-2'>
          {categoriesRender}
        </div>
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
      </div>
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
