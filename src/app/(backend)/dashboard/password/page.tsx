'use client'
import { ChangeUserPassForm } from "@/components/users/ChangeUserPassForm";
import {
  selectIslogin,
  selectIsAdmin,
  selectUser,
} from "@/store/features/auth/authSlice";

import { useAppSelector } from "@/store/hooks";

export default function Home(){
    const user = useAppSelector(selectUser);
    return (
        <div className="">
            <h2 className="text-2xl py-3 self-center text-center">Manage Password</h2>
            <div className="">
                <ChangeUserPassForm/>
            </div>
        </div>
    )
}