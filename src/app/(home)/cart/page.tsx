'use client'
import Image from "next/image";
import { useEffect, useState } from 'react'
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { CartProduct } from "@/components/ProductCardItem";
import { IProduct } from '@/store/features/products/productsAPI';
import { useRouter } from 'next/navigation';
import { selectUser } from "@/store/features/auth/authSlice";
import { selectProducts, getProducts } from '@/store/features/products/productsSlice';
import { Button } from "@/components/ui/button";
export default function About() {
  
  const dispatch = useAppDispatch();
  
  const user = useAppSelector(selectUser);
  const [cartItems, setCartItems] = useState(JSON.parse(localStorage.getItem('cartItems') || '[]'));

  let user_id1 = user.id;
  if (Number(user_id1) === 12) {
    user_id1 = 'all';
  }

  useEffect(() => {
    dispatch(getProducts({ type: "all", user: user_id1 }));
  }, [user.id]);
  
  const products: IProduct[] = useAppSelector(selectProducts);
  console.log(products, "--->>>>>>>>>>>>>>>>>", user_id1);
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
            <div key={index} className="w-full max-w-[1280px] sm:flex border-b-[1px] border-gray-300 pb-3 mx-auto mt-6">
              <div className="w-full flex text-left">
                <div className="w-[140px] sm:w-[140px] text-center">
                  <Image
                    className='w-[70px] bg-white rounded-full content-center aspect-square object-cover'
                    src={product?.image}
                    alt='grass'
                    width={300}
                    height={300}
                  />
                </div>
                
                <div className="w-full content-center ml-6">
                  <p className="sm:ml-6 w-full text-left content-center text-sm sm:text-[16px]">
                    {product?.title}
                  </p>  
                  <p className="sm:ml-6 w-full text-left content-center text-sm sm:text-[16px]">
                    <span className="font-bold">Flavor</span> : {item.flavor_name}
                  </p>
                </div>
                <div className="sm:w-full text-right sm:text-center content-center">
                  <button 
                    className="bg-[#f85454] hover:bg-[#ff775f] sm:w-[80px] sm:h-10 h-8 w-[70px] rounded-sm transition-all duration-700 text-sm sm:text-[16px]"
                    onClick={() => {
                      const newCartItems = [...cartItems];
                      newCartItems.splice(index, 1);
                      setCartItems(newCartItems);
                      localStorage.setItem('cartItems', JSON.stringify(newCartItems));
                      window.dispatchEvent(new Event("storage"));
                    }}
                  >                  
                    Remove
                  </button>
                  {/* <button className="bg-[#f85454] hover:bg-[#ff775f] rounded-full text-xs py-2 px-3 sm:hidden">
                    X
                  </button> */}
                </div>
              </div>
              <div className="w-full flex content-center mt-6 sm:mt-0">
                {item.qty >= item.s_qty ?
                  <div className="w-full text-left content-center grid grid-rows-2 items-center text-xs sm:text-[16px]">
                    <p className="text-gray-500">Save ${Number(product.price) - item.s_price} when buy {item.s_qty} or more</p>
                    <div className="w-full text-left content-center items-center flex text-xs sm:text-[16px]">
                      <span className="flex sm:hidden font-bold mr-3">Price : </span>
                      <p className="line-through">${product? product.price : 'N/A'}</p>
                      <p className="text-red-700">: ${item.s_price}</p>
                    </div>
                  </div>
                  :
                  <p className="w-full text-left content-center flex items-center text-xs sm:text-[16px]"><span className="flex sm:hidden font-bold mr-3">Price : </span>${product? product.price : 'N/A'}</p>
                }
                <p className="w-full text-left content-center flex items-center text-xs sm:text-[16px]"><span className="flex sm:hidden font-bold mr-3">Qty : </span>{item.qty}</p>
                {item.qty >= item.s_qty ?
                  <p className="w-full text-right content-center justify-end flex items-center text-xs sm:text-[16px]"><span className="flex sm:hidden font-bold mr-3">Total : </span><p className="line-through">$ {item.qty * Number(product?.price)}</p><p className="text-red-700">: ${item.qty * Number(item.s_price)}</p></p>
                  :
                  <p className="w-full text-right content-center justify-end flex items-center text-xs sm:text-[16px]"><span className="flex sm:hidden font-bold mr-3">Total : </span>$ {item.qty * Number(product?.price)}</p>
                }
              </div>
            </div>
          );
        })}
      </div>
      <div className="w-full mx-auto max-w-[1280px]">
        <div className="w-full flex items-center justify-center sm:justify-end">
          <div className="space-y-3 mt-3">
            <div className="flex">
              <p className="text-lg font-semibold">{cartItems.length} items</p>
            </div>
            <div className="flex">
              <p className="text-lg font-semibold ">Subtotal:</p>
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
