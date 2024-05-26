'use client'
import Image from 'next/image';
import { ReactEventHandler, useState, useEffect } from 'react';
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { IProduct } from '@/store/features/products/productsAPI';
import { Input } from './ui/input';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { selectUser } from '@/store/features/auth/authSlice';
import { selectIsNothing, selectIsVisitor } from "@/store/features/auth/authSlice";
import { toast } from "react-hot-toast";

import './user.css'
export interface CartProduct {
  product_id: string,
  flavor_name: string,
  qty: number
}

export function ProductCardItem ({product, i}: {product: IProduct, i: number }) {
  const [flavorname, setFlavorName] = useState("")
  const [qty, setQty] = useState< number | null>(null)
  const [selectedOption, setSelectedOption] = useState< number | null>(null)
  const [maxQty, setMaxQty] = useState <number | null>(0)
  const isVisitor = useAppSelector(selectIsVisitor);
  const cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
  const isNothing = useAppSelector(selectIsNothing);

  const handleChange = (event) => {
    setSelectedOption(event.target.value);
    setMaxQty(product.flavor[event.target.value].qty);
    setQty(0);
  };

  const onChange = (event: any) => {
    const value = parseInt(event.target.value, 10)
    
    if(value > maxQty){
      setQty(maxQty)
    } else if(value < 1){
      setQty(0)
    }
     else {
      setQty(value);
    } 
  } 

  const addToCart = () =>{
    if(selectedOption === null){
      toast.error("You must select Flavor");
      return
    }
    const newCartItem : CartProduct = {
      product_id: product.id,
      flavor_name : product.flavor[selectedOption].name,
      qty: qty
    }

    cartItems.push(newCartItem);
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    localStorage.setItem('notification', 'true');
    window.dispatchEvent(new Event("storage"));
    toast.success("You just added an item successfully")
  }

  return (
    <div>
      <DialogTrigger>
        <Card
          className='max-w-sm h-[34rem] rounded overflow-hidden shadow-lg p-2 hover:bg-accent'
          key={'card' + i}>
          <CardHeader className='pb-0'>
            <Image
              className='w-full bg-white rounded-full aspect-square object-cover'
              src={product.image}
              alt='grass'
              width={300}
              height={300}
            />
            <CardTitle className='text-xl text-start px-4 py-2'>{product.title}</CardTitle>
          </CardHeader>
          <CardContent className='text-xl'>
            <CardDescription className='text-xl text-start font-bold px-4'>
                {(!isNothing || !isVisitor) && <div className=''>
                  <pre>price    : ${product.price}</pre>
                </div>}
                <div className='text-lg font-normal '>
                  description : {product.description}
                </div>
            </CardDescription>
          </CardContent>
        </Card>
      </DialogTrigger>
      
      {(!isNothing || !isVisitor) && <div className='w-full content-center text-center flex-row mt-6'>
        <div className='w-[280px] mx-auto flex'>
          <p className='content-center mr-[10px]'>
            Flavor :
          </p>
          <div className='w-[150px]'>
            <select 
              className='mx-0 w-full bg-white text-sm py-2 my-4 shadow-sm focus-visible:outline-none bg-transparent border-[1px] rounded-md' 
              value={selectedOption} 
              onChange={handleChange}
              >
              <option value="">Flavor</option>
              {product.flavor && product.flavor.map((item, index) => (
                <option key={index} value={index}>{item.name}</option>
              ))}
            </select>
        </div>
        
        </div>
        <div className='text-lg flex space-x-2 justify-center place-items-center'>
          
          <div className='flex space-x-3 mx-3'>
            <button 
              className='bg-green-400 p-0 px-[10px] text-lg font-normal hover:bg-green-600 transition-colors duration-700'
              onClick={() => {
                if(qty > 1) setQty(qty - 1.0);
              }}
              >
              -
            </button>
            <Input
              className='w-[150px]'
              placeholder='Qty'
              type='number'
              min={0}
              max={maxQty}
              value={qty}
              onChange={onChange}
            >
            </Input>
            <button 
              className='bg-green-400 p-0 px-2 text-lg font-normal hover:bg-green-600 transition-colors duration-700'
              onClick={() => {
                if(qty < maxQty) setQty(qty + 1.0);
            }}>
              +
            </button>
          </div>
        </div>
        <button 
          className='w-[150px] bg-green-400 mt-6 p-4 text-lg font-normal hover:bg-green-600 transition-colors duration-700'
          onClick={addToCart}
        >
          Add to cart
        </button>
      </div>}
      <DialogContent className='' style={{scrollbarWidth:"none"}}>
        <DialogHeader>
          <DialogTitle className='text-center'>{product.title}</DialogTitle>
          <DialogDescription>
            <Image
              className='w-full bg-white rounded-full aspect-square object-cover'
              src={product.image?product.image:"asdf"}
              alt='grass'
              width={300}
              height={300}
            />
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </div>
  )
};
