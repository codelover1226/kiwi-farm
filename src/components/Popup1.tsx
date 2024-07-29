"use client";
import { useState } from "react";
import Image from "next/image";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  login,
  setUser,
  setIsAdmin,
  setIsVisitor, 
  setIsAgency,
  setNothing,
  setCart
} from "@/store/features/auth/authSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { Input } from "@/components/ui/input";
import { toast } from 'react-hot-toast';
import { setSelectedProduct } from '@/store/features/products/productsSlice';
import { useRouter } from "next/navigation";

export default function Popup1() {
  const [show, setShow] = useState(false); //show warning message
  const dispatch = useAppDispatch();  

  const [password, setPassword] = useState('');
  const [isAdmin, setAdmin] = useState(false);
  const [loading, setLoading] = useState(false);
  const { push } = useRouter();

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
        dispatch(setUser({
          id: user.id,
          title: user.title,
          password: "",
          password1: "",
          slug: "",
          description: "",
          menuList: user.menuList
        }));
        dispatch(setSelectedProduct("-1"));
        toast.success("Welcome");
        setIsOpen(false);
        if (password === user.password) {
          dispatch(login());
          dispatch(setIsAgency(password === user.password));
          dispatch(setIsAdmin(user.content.isAdmin));
          push('/dashboard');
        }
        if (password === user.password1) {
          dispatch(setUser({
            id: "12",
            title: "",
            password: "",
            password1: "",
            slug: "",
            description: "",
            menuList: user.menuList,
          }));
          dispatch(setIsVisitor(password === user.password1));
          dispatch(setCart(true));
          push('/');
        }
      };
    } catch (error) {
      console.error(error);
    }
    setLoading(false)
  };


  const alertCancel1 = () => {
    setIsOpen(false);
    dispatch(setNothing(true));
    dispatch(setUser({
      id: "12",
      title: "",
      password: "",
      password1: "",
      slug: "",
      description: "",
      menuList: "",
    }));
    dispatch(setIsVisitor(false));
    dispatch(setIsAgency(false));
    dispatch(setIsAdmin(false));
    dispatch(setSelectedProduct("-1"));
  };

  const [isOpen, setIsOpen] = useState(true);

  return (
    <AlertDialog open={isOpen}>
      <AlertDialogContent className="xs:max-w-xs md:max-w-md py-8 px-8 ">
        <AlertDialogHeader className="items-center mt-2">
          <Image
            src="/kiwi_farms_text.jpg"
            alt="Kiwi Farms - Premium Cannabis"
            width={180}
            height={100}
            className="pb-3"
          />
          <AlertDialogTitle>Enter Password</AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogDescription className="flex flex-col gap-3 py-4">
          <div className="flex justify-between">
            <Input
              type='password'
              id='password'
              value={password}
              onChange={e => setPassword(e.target.value)}
              className='w-full h-12'
            />
            <AlertDialogAction
              className="h-12 bg-[#017c6b] hover:bg-[#009688]"
              onClick={handleSubmit}
              disabled={loading}
            >
              GO
            </AlertDialogAction>
          </div>
          <AlertDialogCancel
            className="h-12 border-1 outline-2 outline-black hover:border-[#00897b] border-[black]"
            onClick={alertCancel1}
          >
            I don't have one
          </AlertDialogCancel>
        </AlertDialogDescription>
      </AlertDialogContent>
    </AlertDialog>
  );
}
