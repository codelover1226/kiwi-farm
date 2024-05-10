'use client'
import Image from 'next/image';
import { useEffect, useState } from 'react';
import {
  Dialog,
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
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { SanityClient } from 'sanity';
import { IProduct } from '@/store/features/products/productsAPI';
import { selectProducts, getProducts } from '@/store/features/products/productsSlice';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { selectUser } from '@/store/features/auth/authSlice';

// add props to ProductCard

export function ProductCardB (props: any) {
  const { product } = props;
  const products: IProduct[] = useAppSelector(selectProducts);
  const user = useAppSelector(selectUser);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getProducts({type:product, user:user.id }));
  },[])

  return (
    <div className='flex flex-row flex-wrap gap-6 justify-center m-2'>
      
      {products.length!=0?products.map((product: IProduct, i: number) => {
          return (
            <Dialog key={'dialog' + i}>
            <DialogTrigger>
              <Card
                className='max-w-sm w-[300px] h-[29rem] rounded overflow-hidden shadow-lg p-2 hover:bg-accent'
                key={'card' + i}>
                <CardHeader className='pb-0'>
                  <Image
                    className='w-full bg-white rounded-full aspect-square object-cover'
                    src={product.image}
                    // src={product.images[0]}
                    alt='grass'
                    width={150}
                    height={150}
                  />
                  <CardTitle className='text-xl text-start px-0 py-2'>{product.title}</CardTitle>
                </CardHeader>
                <CardContent className='text-xl'>
                  <CardDescription className='text-xl text-start font-bold px-0'>
                      <div className=''>
                        <pre>price    : ${product.price}</pre>
                      </div>
                      <div className=''>
                        <pre>quantity :  {product.quantity}</pre>
                      </div>
                      <div className='text-lg font-normal '>
                        description : {product.description}  
                      </div>
                  </CardDescription>
                </CardContent>
              </Card>
            </DialogTrigger>
            <DialogContent className='' style={{scrollbarWidth:"none"}}>
              <DialogHeader>
                <DialogTitle className='text-center'>{product.title}</DialogTitle>
                <DialogDescription>
                  {/* <PortableText value={product.content} /> */}
                  <Image
                    className='w-full bg-white rounded-full aspect-square object-cover'
                    src={product.image?product.image:"asdf"}
                    // src={product.images[0]}
                    alt='grass'
                    width={300}
                    height={300}
                  />
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
          )
        }
      )
    :<div className='text-red-400'>No items</div>}
    </div>
  );
};
