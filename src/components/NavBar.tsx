'use client'
import { NavMenu } from "@/components/NavMenu";
import Link from "next/link";
import Image from "next/image";
import { ExitIcon } from "@radix-ui/react-icons";
import MobileNavBar from "@/components/MobileNavBar";
import { useRouter } from "next/navigation";
import {
  logout,
} from "@/store/features/auth/authSlice";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { selectUser, selectIsAdmin, selectIsAgency, selectIsCart } from "@/store/features/auth/authSlice";
import { selectProducts, getProducts } from '@/store/features/products/productsSlice';
import { IProduct } from "@/store/features/products/productsAPI";
export function NavBar({backend}) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const isAdministrator = useAppSelector(selectIsAdmin);
  const isAgency = useAppSelector(selectIsAgency);
  const isCart = useAppSelector(selectIsCart);
  const [items, setItems] = useState([]);
  const handleLogout = () => {
    router.push("/");
    dispatch(logout());
  }
  
  const user = useAppSelector(selectUser);
  useEffect(()=>{
    dispatch(getProducts({ type: "all", user: user.id }));
    const handleStorageChange = () => {
      const cartItems = JSON.parse(localStorage.getItem("cartItems"));
      if (cartItems) {
        setItems(cartItems);
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => { window.removeEventListener("storage", handleStorageChange);};
  },[])
  useEffect(() => {
    setItems(JSON.parse(localStorage.getItem('cartItems')));
  }, []);
  console.log(items)
  return (
    <>
      {backend?
      <></>
      :
      <div className="flex py-1 items-center justify-center text-center text-sm bg-[#017c6b] text-white w-full top-0">
        UPDATED DAILY!
      </div>
      }
      <div className="top-0 sticky z-50">
        <div className="py-2 px-5 flex flex-row justify-between border border-color-black w-full sticky top-0 bg-white">
          <div className="flex h-16">
            <Link href="/" className={backend?"sm:ml-0 ml-10 transition-all":""}>
              {/* <CubeIcon className='h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all ' /> */}
              <Image
                src="/kiwi_farms_text.jpg"
                alt="Kiwi Farms - Premium Cannabis"
                width={160}
                height={60}
                className={backend?"":"md:max-lg:hidden"}
              />
            </Link>
          </div>
          <div className="flex">
            
            {backend?
            <>
              <h2 className="text-3xl self-center hidden sm:block text-black text-center ">
                  {isAdministrator?"Admin":"Agent"} Dashboard
              </h2>
              <div className="flex h-16 items-center" onClick={handleLogout}>
                <div className="flex items-center justify-center text-xl py-2 px-4 rounded-sm bg-slate-50 hover:bg-slate-200 cursor-pointer">
                  <span ><ExitIcon width={30} height={30}/></span>
                </div>
              </div>
            </>
            :
            <div className="flex flex-row gap-5 items-center">
              <NavMenu />
              <MobileNavBar />
            </div>
            }
            {(isAgency || isAdministrator || isCart) && 
              <div className="content-center" onClick={()=>{
                localStorage.setItem('notification', 'false')
                router.push('/cart')
              }}>
                <div className={`content-center relative cursor-pointer flex font-bold duration-200 w-[40px] `}>
                  <img src="./carticon.png" className="w-[35px]">
                  </img>
                  <div className="absolute top-1 left-6 text-xs font-bold rounded-full bg-green-300 px-1">
                    {items?.length}
                  </div>
                </div>
              </div>
            }
          </div>
        </div>
      </div>
    </>
  );
}
