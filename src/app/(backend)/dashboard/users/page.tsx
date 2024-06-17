"use client";
import { NewUserForm } from "@/components/users/NewUserForm";
import { DeleteUserForm } from "@/components/users/DeleteUserForm";
import {
  selectIslogin,
  selectIsAdmin,
  selectUser,
} from "@/store/features/auth/authSlice";

import { useAppSelector } from "@/store/hooks";

export default function Home() {
  const user = useAppSelector(selectUser);
  return (
    <div className="">
      <h2 className="text-2xl py-3 self-center text-center">Manage Agents</h2>
      <p className="text-lg self-center text-center px-20 text-blue-800">
        This page is to help you manage your agents. Every agent will have their
        own "private agent password" to access the agent dashboard.
        <br />
        <br />
        Every agent will also have a "visitor password", which will give
        customers the ability to see the agent's items and prices but not have
        access to the agent dashboard.
      </p>
      <div className="">
        <NewUserForm user={user.title} />
        <DeleteUserForm user={user.title} />
        {/* <ChangeUserPassForm/> */}
      </div>
    </div>
  );
}
