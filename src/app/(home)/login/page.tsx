'use client'
import PasswordPromptDialog from '@/components/PasswordPromptDialog';
import {
  login,
  selectIslogin
} from "@/store/features/auth/authSlice";
import { redirect } from 'next/navigation';

import { useAppDispatch, useAppSelector } from "@/store/hooks";

export default function Login() {
  const isLogin = useAppSelector(selectIslogin);
  if(isLogin) {
    redirect('/dashboard');
  }
  return (
    <div className='min-h-[calc(100vh-220px)]'>
      <PasswordPromptDialog />
    </div>
  );
}
