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
export function ProductCard ({product, user_id}: {product: string, user_id:string }) {
  const products: IProduct[] = useAppSelector(selectProducts);
  const dispatch = useAppDispatch();
  console.log(products)
  useEffect(() => {
    dispatch(getProducts({type:product, user:user_id }));//super admin's id
  },[])
  // const productsRender = [];

  // products.forEach((product: IProduct, i: number) => {
  //   productsRender.push(
  //     <Dialog key={'dialog' + i}>
  //       <DialogTrigger>
  //         <Card
  //           className='max-w-sm h-[36rem] rounded overflow-hidden shadow-lg p-2 hover:bg-accent'
  //           key={'card' + i}>
  //           <CardHeader>
  //             <Image
  //               className='w-full bg-white rounded-full aspect-square object-cover'
  //               src={product.image}
  //               // src={product.images[0]}
  //               alt='grass'
  //               width={300}
  //               height={300}
  //             />
  //             <CardTitle className='text-xl'>{product.title}</CardTitle>
  //           </CardHeader>
  //           <CardContent className='text-start'>
  //             <CardDescription >
  //               <div className='flex pb-3'>
  //                 <div className='flex-1'>
  //                   price    : ${product.price}
  //                 </div>
  //                 <div className='flex-1'>
  //                   quantity : {product.quantity}
  //                 </div>
  //               </div>
  //             </CardDescription>
  //             {/* <CardDescription>price    : ${product.price}</CardDescription> */}
  //             {/* <CardDescription>quantity : {product.quantity}</CardDescription> */}
  //             <CardDescription>description : {product.description}</CardDescription>
  //           </CardContent>
  //         </Card>
  //       </DialogTrigger>
  //       <DialogContent className='' style={{scrollbarWidth:"none"}}>
  //         <DialogHeader>
  //           <DialogTitle className='text-center'>{product.title}</DialogTitle>
  //           <DialogDescription>
  //             {/* <PortableText value={product.content} /> */}
  //             <Image
  //               className='w-full bg-white rounded-full aspect-square object-cover'
  //               src={product.image}
  //               // src={product.images[0]}
  //               alt='grass'
  //               width={300}
  //               height={300}
  //             />
  //           </DialogDescription>
  //         </DialogHeader>
  //       </DialogContent>
  //     </Dialog>,
  //   );
  // });
  return (
    <div className='flex flex-row flex-wrap gap-6 justify-center m-2'>
      {products.map((product: IProduct, i: number) => { 
        if( product.user_id != "12" ) return; 
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
