'use client'
import { SideBar } from "@/components/SideBar";
import React, { useState } from "react";
import {
  selectIsAdmin
} from "@/store/features/auth/authSlice";

import { useAppSelector } from "@/store/hooks";

export default function DashboardLayout({
    children,
  }: {
    children: React.ReactNode;
  }) {
    const isAdministrator = useAppSelector(selectIsAdmin);
    const [bar, setBar] = useState("bar");
    const [isActiveSideBar, setIsActiveSideBar] = useState(false);// for mobile
    const openDrawer = () => {
        if(bar == 'bar') {
            setBar("bar active")
            setIsActiveSideBar(true)
        }else{
            setBar("bar")
            setIsActiveSideBar(false)
        }
    }
    const onMenuClick = () => {
      setBar("bar")
      setIsActiveSideBar(false)
    };
    return (     
        <div className=" flex flex-row">
            <button onClick={openDrawer} className="button_close top-[11px] sm:ml-[-60px] ml-[-8px] transition-all"><span className={"bg-black " + bar}></span></button>    
            
            <SideBar isAdmin={isAdministrator} isActive={isActiveSideBar} handleMenuClick={onMenuClick}/>  
            <div className="flex-1">
                {/* {                        
                    React.Children.map(children, (child, index) => 
                            React.isValidElement(child)
                            ? React.cloneElement(child as React.ReactElement<any>, {key:index})
                            : child
                        )     
                } */}
                {children}
            </div>  
        </div>    
    );
  }