"use client";
import { ManagePassword } from "@/components/ManagePassword";
import { selectUser } from "@/store/features/auth/authSlice";

import { useAppSelector } from "@/store/hooks";

export default function Home() {
  const user = useAppSelector(selectUser);
  return (
    <div className="">
      <h2 className="text-2xl py-3 self-center text-center">Manage Viewer</h2>
      <p className="text-lg self-center text-center px-20 text-blue-800">
        This page is to help you manage the full menu list that you want to show
        different customers.
        <br />
        <br />
      </p>
      <div className="">
        <ManagePassword user={user.title} />
      </div>
    </div>
  );
}
