'use client'
import { NewUserForm } from "@/components/users/NewUserForm"
import { DeleteUserForm } from "@/components/users/DeleteUserForm"
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
            <h2 className="text-2xl py-3 self-center text-center">Manage Agents</h2>
            <div className="">
                <NewUserForm user={user.title}/>
                <DeleteUserForm user={user.title}/>
                {/* <ChangeUserPassForm/> */}
            </div>
        </div>
    )
}