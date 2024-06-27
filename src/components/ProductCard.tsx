'use client'
import Image from 'next/image';
import { useEffect, useState } from 'react';
import {
  Dialog,
} from '@/components/ui/dialog';
import { IProduct } from '@/store/features/products/productsAPI';
import { selectProducts, getProducts } from '@/store/features/products/productsSlice';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { ProductCardItem } from './ProductCardItem';
import { selectUser } from "@/store/features/auth/authSlice";
import { Cross2Icon } from '@radix-ui/react-icons';
import { useRouter } from 'next/navigation'

export function ProductCard({ product, user_id }: { product: string, user_id: string }) {
  const products: IProduct[] = useAppSelector(selectProducts);
  const [items, setItems] = useState([]);
  const [notification, setNotification] = useState('false');
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const router = useRouter();
  let user_id1 = user.id;
  if (Number(user_id1) === 12) {
    user_id1 = 'all';
  }

  useEffect(() => {
    dispatch(getProducts({ type: product, user: user_id1 }));
    setItems(JSON.parse(localStorage.getItem("cartItems") || '[]'));
    setNotification(localStorage.getItem('notification') || '');
  }, [dispatch, product, user.id]);

  useEffect(() => {
    const handleStorageChange = () => {
      const cartItems = JSON.parse(localStorage.getItem("cartItems") || '[]');
      const notificationStatus = localStorage.getItem('notification') || '';
      if (cartItems) {
        setItems(cartItems);
      }
      setNotification(notificationStatus);
    };
    window.addEventListener("storage", handleStorageChange);
    return () => { window.removeEventListener("storage", handleStorageChange); };
  }, [dispatch]);

  const lastProduct: IProduct = products.find(p => p.id === items[items.length-1]?.product_id)

  const handleCheckout = () => {
    localStorage.setItem('notification', 'false')
    window.dispatchEvent(new Event("storage"));
    setNotification('false')
    router.push('/cart')
  }
  const handleClose = () => {
    localStorage.setItem('notification', 'false')
    window.dispatchEvent(new Event("storage"));
    setNotification('false')
  }

  return (
    <div className='flex flex-row flex-wrap gap-6 justify-center m-2'>
      <div className='fixed top-[115px] right-0'>
        <div className={`bg-slate-200 p-3 w-[240px] ${notification === 'true' ? 'translate-x-0' : 'translate-x-[280px]'} duration-1000 rounded-l-[10px]  relative`}>
          <div className='absolute right-2 top-3 hover:cursor-pointer'>
            <Cross2Icon className='hover:rotate-180 duration-500' onClick={handleClose}/>
          </div>
          <div className='w-full'>
              <div className='w-full flex space-x-3 content-center'>
                <img src={lastProduct?.image} className='rounded-full w-[60px] h-[60px]'>
                </img>
                <p className='text-sm font-bold mt-[20px]'>{lastProduct?.title}</p>
              </div>
              <div className='w-full flex justify-between mt-3'>
                <p className='text-xs font-bold'>
                  ${lastProduct?.price}
                </p>
                <p className='text-xs font-bold'>
                  Quantity : {items[items.length-1]?.qty}
                </p>
                <p className='text-xs font-bold'>
                Total: ${+ ((+lastProduct?.price?? 0) * (+items[items.length-1]?.qty?? 0))}
                </p>
              </div>
              <div className='w-full flex text-center mt-3'>
                <button className='bg-green-400 hover:bg-green-300 duration-300 mx-auto px-2 py-1' onClick={handleCheckout}>
                  Check out
                </button>
              </div>
            </div>
        </div>      
      </div>
      
      {products.map((product: IProduct, i: number) => { 
        return (
          <Dialog key={'dialog' + i}>
            <ProductCardItem 
              product={product}
              i={i}
            />
          </Dialog>
        )}
      )}
    </div>
  );
};
