'use client'
import { ManagePassword } from "@/components/ManagePassword"
import {
  selectUser,
} from "@/store/features/auth/authSlice";

import { useAppSelector } from "@/store/hooks";

export default function Home(){
    const user = useAppSelector(selectUser);
    return (
        <div className="">
            <h2 className="text-2xl py-3 self-center text-center">Manage Agents</h2>
            <div className="">
                <ManagePassword user={user.title}/>
            </div>
        </div>
    )
}