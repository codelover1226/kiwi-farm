'use client'
import Image from "next/image";
import { useState } from 'react'
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { CartProduct } from "@/components/ProductCardItem";
import { IProduct } from '@/store/features/products/productsAPI';
import { useRouter } from 'next/navigation';
import { selectProducts, getProducts } from '@/store/features/products/productsSlice';
import { Button } from "@/components/ui/button";

export default function About() {
  const products: IProduct[] = useAppSelector(selectProducts);
  const [cartItems, setCartItems] = useState(JSON.parse(localStorage.getItem('cartItems') || '[]'));
  const subtotal = cartItems.reduce((acc, item) => acc + (item.qty * Number(products.find(p => p.id === item.product_id)?.price || 0)), 0);
  const router = useRouter();
  return (
    <main className=" min-h-screen mb-20 pt-10 pb-10 px-5 md:px-20">
      <p className="w-full text-center text-[30px]">
        Your Cart
      </p>
      <div className="w-full text-center">
        <div className="w-full max-w-[1280px] flex border-b-[1px] border-gray-300 pb-3 mx-auto mt-6">
          <div className="w-full text-left sm:flex hidden">
            Product
          </div>
          <div className="w-full sm:flex hidden">
            <p className="w-full text-left">Price</p>
            <p className="w-full text-left">Quantity</p>
            <p className="w-full text-right">Total</p>
          </div>
        </div>
        {cartItems.map((item: CartProduct, index: number) => {
          const product : IProduct = products.find(p => p.id === item.product_id);
          return (
            <div key={index} className="w-full max-w-[1280px] flex border-b-[1px] border-gray-300 pb-3 mx-auto mt-6">
              <div className="w-full text-left sm:flex">
                <Image
                  className='w-[70px] bg-white rounded-full content-center aspect-square object-cover'
                  src={product.image}
                  alt='grass'
                  width={300}
                  height={300}
                />
                <div className="w-full content-center">
                  <p className="sm:ml-6 w-full text-left content-center">
                    {product.title}
                  </p>  
                  <p className="sm:ml-6 w-full text-left content-center">
                    <span className="font-bold">Flavor</span> : {item.flavor_name}
                  </p>
                </div>
                <div className="w-full text-center content-center">
                  <button 
                    className="bg-[#f85454] hover:bg-[#ff775f] w-[80px] h-10 rounded-sm transition-all duration-700"
                    onClick={() => {
                      const newCartItems = [...cartItems];
                      newCartItems.splice(index, 1);
                      setCartItems(newCartItems);
                      localStorage.setItem('cartItems', JSON.stringify(newCartItems));
                    }}
                  >                  
                    Remove
                  </button>
                </div>
              </div>
              <div className="w-full sm:flex content-center">
                <p className="w-full text-center sm:text-left content-center">$ {product? product.price : 'N/A'}</p>
                <p className="w-full text-center sm:text-left content-center">{item.qty}</p>
                <p className="w-full text-center sm:text-right content-center">$ {item.qty * Number(product.price)}</p>
              </div>
            </div>
          );
        })}
      </div>
      <div className="w-full mx-auto max-w-[1280]  float-right">
        <div className="w-full flex items-center justify-end">
          <div className="space-y-3 mt-3">
            <div className="flex">
              <p className="text-lg font-semibold">{cartItems.length} items</p>
            </div>
            <div className="flex">
              <p className="text-lg font-semibold">Subtotal:</p>
              <p className="text-lg font-semibold">$ {subtotal.toFixed(2)}</p>
            </div>
            <div className="">
              <Button
                  className={"bg-[#017c6b] hover:bg-[#009688] w-32 h-12 mt-2 "}
                  onClick={() => {
                    router.push('/checkout')
                  }}
                >
                  Check Out
                </Button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
