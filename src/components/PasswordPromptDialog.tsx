'use client';

import React, { useReducer, useState, useEffect } from 'react';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from './ui/card';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { toast } from 'react-hot-toast';
import {
  login,
  setUser,
  setIsAdmin,
  setIsVisitor, 
  setIsAgency 
} from "@/store/features/auth/authSlice";
import { setSelectedProduct } from '@/store/features/products/productsSlice';

import { useAppDispatch, useAppSelector } from "@/store/hooks";

const PasswordPromptDialog = () => {
  const dispatch = useAppDispatch();

  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const [isAdmin, setAdmin] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(`/api/auth/login`, {
        body: JSON.stringify({ password, isAdmin }),
        headers: { 'Content-Type': 'application/json' },
        method: 'post',
      });

      const res = await response.json()

      if (response.status !== 200){
        toast.error(res)
        console.error(res)
      } else {
        const user = res;
        dispatch(login());
        dispatch(setUser(user));
        dispatch(setIsVisitor(password === user.password1));
        dispatch(setIsAgency(password === user.password));
        dispatch(setIsAdmin(user.content.isAdmin));
        dispatch(setSelectedProduct("-1"));
      };
    } catch (error) {
      console.error(error);
    }
    setLoading(false)
  };

  return (
    <div className='password-prompt-dialog flex justify-center pt-20'>
      <Card className='shadow-none p-4'>
        <CardHeader className='space-y-1'>
          <CardTitle className='text-2xl'>User Login</CardTitle>
          {/* <CardTitle className='text-2xl'>Enter Password</CardTitle> */}
          <CardDescription>
            Enter your password & user type below for access
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className='grid gap-4'>
            {/* <div className="flex flex-row justify-items-center">
              <Label htmlFor='password' className='self-center pr-4'>Admin ? :</Label>
              <Input
                type='checkbox'
                id='isAdmin'
                checked={isAdmin}
                onChange={e => setAdmin(e.target.checked)}
                className='w-5'
              />
            </div> */}
            <Label htmlFor='password'>Password:</Label>
            <Input
              type='password'
              id='password'
              value={password}
              onChange={e => setPassword(e.target.value)}
              className='w-full'
            />
          </CardContent>
          <CardFooter>
            <Button
              type='submit'
              className='hover:bg-[#009688] bg-[#017c6b] w-32 h-10' disabled={loading}>
              Enter
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

{
  /* <form onSubmit={handleSubmit}>
        <label htmlFor='password'>Password:</label>
        <input
          type='password'
          id='password'
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <button type='submit'>Submit</button>
      </form> */
}
export default PasswordPromptDialog;
