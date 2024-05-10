'use client'
import Footer from "@/components/Footer";
import { NavBar } from "@/components/NavBar";
import Link from 'next/link';
import React from "react";
import {
  selectIslogin
} from "@/store/features/auth/authSlice";

import { useAppSelector } from "@/store/hooks";

export default function BackEndLayout({ children }: {children: React.ReactNode}) {
  console.log("BackEnd layout")
  const isLogin = useAppSelector(selectIslogin); 
  return (    
        <div >
            <NavBar backend={true}/>
            {isLogin?(
              <div className="min-h-[calc(100vh-175px)]">
                {children}
              </div>            
            ):
            <div className='pt-20 flex flex-col justify-start xs:px-4 md:px-6'>
              <h1 className="text-xl text-center">Sorry, you are not authorized to view this page.</h1>
              <div></div>
              <h2 className="text-xl text-center">
                Please{' '}
                <Link href={'/login'} className='underline'>
                  Login
                </Link>
                .
              </h2>
            </div>
            }
            <Footer />
        </div>
  );
}