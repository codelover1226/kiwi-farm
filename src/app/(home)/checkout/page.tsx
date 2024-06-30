'use client'
import Image from "next/image";
import { useEffect, useState } from 'react'
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { CartProduct } from "@/components/ProductCardItem";
import { IProduct } from '@/store/features/products/productsAPI';
import { useRouter } from 'next/navigation';
import { selectProducts, getProducts } from '@/store/features/products/productsSlice';
import data from'./../../../lib/uscity.json'
import { Button } from "@/components/ui/button";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { CustomSelect } from "@/components/ui/select"
import { toast } from "react-hot-toast";
import { selectUser } from "@/store/features/auth/authSlice";
import {ICoupons} from "./../../(backend)/dashboard/normalCoupon/page"
import _ from 'lodash';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Item } from "@radix-ui/react-navigation-menu";

const newCustomerSchema = z.object({
  name: z.string().min(1, { message: "name is required." }),
  email: z.string().email({ message: "Invalid email address" }),
  phoneNumber: z.string().regex(/^\d{3}-\d{3}-\d{4}$/, { message: "Phone number must be in the format 123-456-7890" }),
  refName: z.string().min(1, { message: "name is required." }),
  refPhoneNumber: z.string().regex(/^\d{3}-\d{3}-\d{4}$/, { message: "Phone number must be in the format 123-456-7890" }),
  state: z.string().min(1, {message: "Please select your state"}),
  city: z.string().min(1, {message: "Please select your city"}),
  address: z.string().min(1, {message: "Please select your address"}),
  deliveryInstruction: z.string().min(1, {message: "Please Enter your Delivery Instruction"}),
});

export default function About() {
  var today = new Date();
  var time = today.getDay() + "-" + today.getMonth() + "-" + today.getFullYear();
  const [couponField, setCouponField] = useState(true)
  const [couponCode, setCouponCode] = useState<string | null>("")
  const [isLoading, setIsLoading] = useState(false);
  const [delivery_date, setDeliveryDate] = useState<string | null>(time);
  const [checked, setChecked] = useState(true)
  const products: IProduct[] = useAppSelector(selectProducts);
  const [cartItems, setCartItems] = useState(JSON.parse(localStorage.getItem('cartItems') || '[]'));
  const [couponVal, setCouponVal] = useState<ICoupons>(null)
  const [subTotal, setSubTotal] = useState<Number>(0);
  let tempSub: number = 0;

  const user = useAppSelector(selectUser);
  const dispatch = useAppDispatch();

  

  let checkoutProducts = [];
  for (let i = 0; i < cartItems.length; i++) {
    let cProduct = _.cloneDeep(products.find(p=> p.id === cartItems[i].product_id));
    if (cProduct) {
        cProduct.quantity = "0";
        for (let j = 0; j < cProduct.flavor.length; j++) {
          if (cProduct.flavor[j].name === cartItems[i].flavor_name) {
            cProduct.flavor[j].qty -= Number(cartItems[i].qty);
          }
        }
        checkoutProducts.push(cProduct);
    } else {
        console.error(`Product with id ${cartItems[i].product_id} not found.`);
    }
  }

  let user_id1 = user.id;
  if (Number(user_id1) === 12) {
    user_id1 = 'all';
  }

  const updateProducts = () => {
    dispatch(getProducts({type:"all", user: user_id1}));
  }

  useEffect(() => {
    updateProducts();
    setSubTotal(cartItems.reduce((acc, item) => {
      const product = products.find(p => p.id === item.product_id);
      if (!product) return acc;
      let price = 0;
      if (item.s_qty < item.qty) {
        price = Number(item.s_price);
      }else{
        price = Number(product.price);
      }
      if (isNaN(price)) return acc; 
      return acc + (item.qty * price);
    }, 0));
  }, []);

  const form = useForm<z.infer<typeof newCustomerSchema>>({
    resolver: zodResolver(newCustomerSchema),
    defaultValues: {
      name: "",
      email: "",
      phoneNumber: "",
      refName: "",
      refPhoneNumber: "",
      state: "",
      city: "",
      deliveryInstruction: ""
    },
  });
//
  async function onSubmit(values: z.infer<typeof newCustomerSchema>) {
    try {
      const formData = new FormData();
      for (const key in values) {
        if (Object.prototype.hasOwnProperty.call(values, key)) {
          const value = values[key];
          formData.append(key, value);
        }
      }
      formData.append("deliveryTiem", delivery_date)
      formData.append("cartItems" , JSON.stringify(cartItems))
      formData.append("coupon_code", couponVal.code),
      formData.append("cProduct", JSON.stringify(checkoutProducts));
      setIsLoading(true);
      const response = await fetch("/api/products/checkout", {
        method: "POST",
        body: formData,
      });
      if (response.status === 200) {
        updateProducts();
        localStorage.removeItem("cartItems")
        toast.success("You added the new product!.");
        // router.push('/thanks')
      } else {
        const error = await response.json();
        toast.error(error);
        
      }
    } catch (error) {
      toast.error(error.message);
    }
    setIsLoading(false);
  }
  const onCouponChange = (event: any) => {
    setCouponCode(event.target.value)
  }

  const showCoupon = (event:any) => {
    event.preventDefault(false)
    setCouponField(!couponField)
  }
  async function applyCoupon (event:any){
    event.preventDefault(false);
    const formData = new FormData();
    formData.append('code', couponCode);
    try {
      const response = await fetch("/api/coupons/getbyname", {
        method: "POST",
        body: formData,
      });
      if(response.ok) {
        tempSub = 0;
        const data = await response.json();
        const jsonData = JSON.parse(data);
        setCouponVal(jsonData[0]);
        for (let i = 0; i < cartItems.length; i++) {
          const product : IProduct = products.find(p => p.id === cartItems[i].product_id);
          if (jsonData[0].discount === undefined) {
            if (cartItems[i].qty > cartItems[i].s_qty) {
              tempSub += cartItems[i].qty * Number(cartItems[i].s_price);
            }else{
              tempSub += cartItems[i].qty * Number(product.price);
            }
          }else{
            if (cartItems[i].qty > cartItems[i].s_qty) {
              tempSub += (cartItems[i].qty * Number(cartItems[i].s_price) * (100 - jsonData[0].discount)) / 100;
            }else{
              tempSub += (cartItems[i].qty * Number(product.price) * (100 - jsonData[0].discount)) / 100;
            }
          }
        }
        setSubTotal(tempSub);
        toast.success("Coupon code has been successfully applied")
      }else{
        toast.error('Cannot find coupon');
        setCouponVal({
          id: "",
          code: "",
          product: undefined,
          discount: 0
        })
        for (let i = 0; i < cartItems.length; i++) {
          const product : IProduct = products.find(p => p.id === cartItems[i].product_id);
          tempSub += cartItems[i].qty * Number(product.price);
        }
        setSubTotal(tempSub);
      }
    }
    catch(error){
      toast.error(error)
    }
  }
  return (
    <main className=" min-h-[68vh] mb-20 pt-10 pb-10 px-5 md:px-20">
      <p className="w-full text-center text-[30px]">
        CheckOut
      </p>
      <div className="w-full lg:flex max-w-[1280px] mx-auto flex-row-reverse space-x-4">
        <div className="w-full">
          <Form {...form}>
            <form className="flex py-5 mb-0 justify-center px-4" onSubmit={form.handleSubmit(onSubmit)}>
              <div className="flex md:flex-row flex-wrap text-left  items-center gap-2">
                <div className=" flex flex-row flex-wrap bg-accent rounded-sm p-6 justify-evenly sm:gap-6 gap-4 space-y-5">
                  <div className="w-full space-y-2">
                    <button className="outline-none w-full text-center font-bold" onClick={showCoupon}>
                      Have a coupon? Please click here
                    </button>
                    <div className={`w-full px-1 transition-max-height duration-500 ease-linear transform overflow-hidden ${couponField? 'max-h-0' : 'max-h-[90px]'}`}>
                      <div className="w-full mt-1">
                        <Input
                          maxLength={10}
                          className="bg-white mt-0 focus-visible:outline-none"
                          placeholder="Your Coupon Code"
                          value={couponCode}
                          onChange={onCouponChange}
                        />
                      </div>
                      <button onClick={applyCoupon} className="w-full bg-black hover:bg-gray-500 transition-all duration-500 text-white font-bold mt-2 py-2 rounded-sm">
                        Apply
                      </button>
                    </div>
                  </div>
                  <div className="w-full">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem className="sm:flex w-full justify-center gap-3">
                          <FormLabel className="min-w-[90px] max-w-[100px] self-center text-xs sm:text-sm text-black font-semibold">
                            Name :
                          </FormLabel>
                          <FormControl
                            className="w-full min-w-[128px] "
                            style={{
                              marginTop: 0,
                            }}
                          >
                            <div>
                              <Input
                                maxLength={40}
                                className="bg-white mt-0"
                                placeholder="Enter your name"
                                {...field}
                              />
                              <FormMessage className="absolute" />
                            </div>
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="w-full">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem className="sm:flex w-full justify-center gap-3">
                          <FormLabel className="min-w-[90px] max-w-[100px] self-center text-xs sm:text-sm text-black font-semibold ">
                            Email :
                          </FormLabel>
                          <FormControl
                            className="w-full min-w-[128px]  "
                            style={{
                              marginTop: 0,
                            }}
                          >
                            <div>
                              <Input
                                maxLength={40}
                                className="bg-white mt-0"
                                placeholder="Enter your email"
                                {...field}
                              />
                              <FormMessage className="absolute" />
                            </div>
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="w-full flex space-x-2">
                    <FormField
                      control={form.control}
                      name="state"
                      render={({ field }) => (
                        <FormItem className="sm:flex w-full justify-center gap-3">
                          <FormLabel className="min-w-[90px] max-w-[100px] self-center text-xs sm:text-sm text-black font-semibold ">
                            State :
                          </FormLabel>
                          <FormControl
                            className="w-full min-w-[128px]  "
                            style={{
                              marginTop: 0,
                            }}
                          >
                            <div>
                              <Input
                                maxLength={40}
                                className="bg-white mt-0"
                                placeholder="Please input your state"
                                {...field}
                              />
                              <FormMessage className="absolute" />
                            </div>
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                  </div>
                  <div className="w-full">
                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem className="sm:flex w-full justify-center gap-3">
                          <FormLabel className="min-w-[90px] max-w-[100px] self-center text-xs sm:text-sm text-black font-semibold ">
                            City :
                          </FormLabel>
                          <FormControl
                            className="w-full min-w-[128px]  "
                            style={{
                              marginTop: 0,
                            }}
                          >
                            <div>
                              <Input
                                maxLength={40}
                                className="bg-white mt-0"
                                placeholder="Please input your state"
                                {...field}
                              />
                              <FormMessage className="absolute" />
                            </div>
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="w-full">
                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem className="sm:flex w-full justify-center gap-3">
                          <FormLabel className="min-w-[90px] max-w-[100px] self-center text-xs sm:text-sm text-black font-semibold ">
                            Address :
                          </FormLabel>
                          <FormControl
                            className="w-full min-w-[128px]  "
                            style={{
                              marginTop: 0,
                            }}
                          >
                            <div>
                              <Input
                                maxLength={40}
                                className="bg-white mt-0"
                                placeholder="Input your delivery Address"
                                {...field}
                              />
                              <FormMessage className="absolute" />
                            </div>
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="w-full">
                    <FormField
                      control={form.control}
                      name="phoneNumber"
                      render={({ field }) => (
                        <FormItem className="sm:flex w-full justify-center gap-3">
                          <FormLabel className="min-w-[90px] max-w-[100px] self-center text-xs sm:text-sm text-black font-semibold ">
                            Phone Number :
                          </FormLabel>
                          <FormControl
                            className="w-full min-w-[128px]  "
                            style={{
                              marginTop: 0,
                            }}
                          >
                            <div>
                              <Input
                                maxLength={12}
                                className="bg-white mt-0"
                                placeholder="Phone Number (123-456-7890)"
                                {...field}
                              />
                              <FormMessage className="absolute" />
                            </div>
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="w-full">
                    <FormField
                      control={form.control}
                      name="refName"
                      render={({ field }) => (
                        <FormItem className="sm:flex w-full justify-center gap-3">
                          <FormLabel className="min-w-[90px] max-w-[100px] self-center text-xs sm:text-sm text-black font-semibold ">
                            Referral Name:
                          </FormLabel>
                          <FormControl
                            className="w-full min-w-[128px]  "
                            style={{
                              marginTop: 0,
                            }}
                          >
                            <div>
                              <Input
                                maxLength={40}
                                className="bg-white mt-0"
                                placeholder="Enter a referral name"
                                {...field}
                              />
                              <FormMessage className="absolute" />
                            </div>
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="w-full">
                    <FormField
                      control={form.control}
                      name="refPhoneNumber"
                      render={({ field }) => (
                        <FormItem className="sm:flex w-full justify-center gap-3">
                          <FormLabel className="min-w-[90px] max-w-[100px] self-center text-xs sm:text-sm text-black font-semibold ">
                            Referral  Phone :
                          </FormLabel>
                          <FormControl
                            className="w-full min-w-[128px]  "
                            style={{
                              marginTop: 0,
                            }}
                          >
                            <div>
                              <Input
                                maxLength={12}
                                className="bg-white mt-0"
                                placeholder="Referral Phone Number (123-456-7890)"
                                {...field}
                              />
                              <FormMessage className="absolute" />
                            </div>
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="w-full">
                    <FormField
                      control={form.control}
                      name="deliveryInstruction"
                      render={({ field }) => (
                        <FormItem className="sm:flex w-full justify-center gap-3">
                          <FormLabel className="min-w-[90px] max-w-[100px] self-center text-xs sm:text-sm text-black font-semibold ">
                            Delivery Instruction :
                          </FormLabel>
                          <FormControl
                            className="w-full min-w-[128px]  "
                            style={{
                              marginTop: 0,
                            }}
                          >
                            <div>
                              <Input
                                maxLength={400}
                                className="bg-white mt-0"
                                placeholder="Delivery Instruction"
                                {...field}
                              />
                              <FormMessage className="absolute" />
                            </div>
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="w-full flex justify-between">
                    <div className="min-w-[150px] self-center ">
                      Delivery Time:
                    </div>
                    <div className="w-full space-x-3 flex">
                      <p>
                        <input
                          type="checkbox"
                          className="accent-pink-500"
                          checked={checked}
                          onChange={(e) => setChecked(e.target.checked)}
                        />
                        <span className="text-sm item-center pt-1 pl-1 mb-1">
                          ASAP
                        </span>
                      </p>
                      <p>
                        <input
                          type="checkbox"
                          className="accent-pink-500"
                          checked={!checked}
                          onChange={(e) => setChecked(!e.target.checked)}
                        />
                        <span className="text-sm item-center pt-1 pl-1 mb-1">
                          Custom Delivery
                        </span>
                      </p>
                    </div>
                  </div>
                  <div className="w-full text-center">
                    <Input
                      type="date"
                      value={delivery_date}
                      onChange={(event:any) => {setDeliveryDate(event.target.value)}}
                      className="bg-white mt-0 w-[150px] mx-auto"
                    />
                  </div>
                  <div className="w-full text-center">
                    <Button
                      className={"bg-[#017c6b] hover:bg-[#009688] w-32 h-12 mt-2 "}
                      type="submit"
                      disabled={isLoading}
                    >
                      Complete Order
                    </Button>
                </div>
                </div>
              </div>
            </form>
          </Form>
        </div>
        <div className="w-full">
          <div className="w-full text-center">
            <div className="w-full border-b-[1px] grid grid-cols-3 border-gray-300 pb-3 mx-auto mt-6">
              <div className="w-full text-left sm:flex col-span-1 hidden">
                Product
              </div>
              <div className="w-full sm:flex col-span-2 ml-5 hidden">
                <p className="w-full text-left">Price</p>
                <p className="w-full text-left">Quantity</p>
                <p className="w-full text-left">Total</p>
              </div>
            </div>
            {cartItems.map((item: CartProduct, index: number) => {
              const product : IProduct = products.find(p => p.id === item.product_id);
              const disProduct = couponVal?.product?.find(p=> p.product === String(item.product_id));
              return (
                <div>
                  <div key={index} className="w-full max-w-[1280px] grid grid-cols-3 border-b-[1px] border-gray-300 pb-3 mx-auto mt-6">
                    <div className="w-full text-left col-span-1 sm:flex">
                      <Image
                        className='w-[70px] bg-white rounded-full content-center aspect-square object-cover'
                        src={product?.image}
                        alt='grass'
                        width={300}
                        height={300}
                      />
                      <div className="w-full content-center">
                        <p className="sm:ml-6 w-full text-left content-center">
                          {product?.title}
                        </p>  
                        <p className="sm:ml-6 w-full text-left content-center">
                          <span className="font-bold">Flavor</span> : {item.flavor_name}
                        </p>
                      </div>
                    </div>
                    <div className="w-full flex content-center mt-6 col-span-2 ml-5 sm:mt-0">
                      {item.qty >= item.s_qty ?
                        couponVal?.code ?
                          <div className="w-full text-left content-center grid grid-rows-2 items-center text-xs sm:text-[16px]">
                            <p className="text-gray-500">Save ${Number(product.price) - item.s_price} when buy {item.s_qty} or more</p>
                            <div className="w-full text-left content-center items-center flex text-xs sm:text-[16px]">
                              <span className="flex sm:hidden font-bold mr-3">Price : </span>
                              <p className="line-through">${product? product.price : 'N/A'}</p>
                              <p className="text-red-700">: ${item.s_price * (100 - couponVal?.discount) / 100}</p>
                            </div>
                          </div>
                          :
                          <div className="w-full text-left content-center grid grid-rows-2 items-center text-xs sm:text-[16px]">
                            <p className="text-gray-500">Save ${Number(product.price) - item.s_price} when buy {item.s_qty} or more</p>
                            <div className="w-full text-left content-center items-center flex text-xs sm:text-[16px]">
                              <span className="flex sm:hidden font-bold mr-3">Price : </span>
                              <p className="line-through">${product? product.price : 'N/A'}</p>
                              <p className="text-red-700">: ${item.s_price}</p>
                            </div>
                          </div>
                        :
                        couponVal?.code ?
                        <div className="w-full text-left content-center flex items-center text-xs sm:text-[16px]"><span className="flex sm:hidden font-bold mr-3">Price : </span><p className="line-through">${product? Number(product.price) : 'N/A'}</p><p className="text-red-700">: ${product? Number(product.price) * (100 - couponVal?.discount) /100 : 'N/A'}</p></div>
                        :
                        <p className="w-full text-left content-center flex items-center text-xs sm:text-[16px]"><span className="flex sm:hidden font-bold mr-3">Price : </span>${product? product.price : 'N/A'}</p>
                      }
                      <p className="w-full text-left content-center flex items-center text-xs sm:text-[16px]"><span className="flex sm:hidden font-bold mr-3">Qty : </span>{item.qty}</p>
                      {item.qty >= item.s_qty ?
                        couponVal?.code ?
                          <div className="w-full text-left content-center flex items-center text-xs sm:text-[16px]"><span className="flex sm:hidden font-bold mr-3">Total : </span><div className="line-through">${item.qty * Number(product?.price)}</div><p className="text-red-700">: ${item.qty * Number(item.s_price) * (100 - couponVal?.discount) / 100}</p></div>
                          :
                          <div className="w-full text-left content-center flex items-center text-xs sm:text-[16px]"><span className="flex sm:hidden font-bold mr-3">Total : </span><p className="line-through">${item.qty * Number(product?.price)}</p><p className="text-red-700">: ${item.qty * Number(item.s_price)}</p></div>
                        :
                        couponVal?.code ?
                          <div className="w-full text-left content-center flex items-center text-xs sm:text-[16px]"><span className="flex sm:hidden font-bold mr-3">Total : </span><p className="line-through">${item.qty * Number(product?.price)}</p><p className="text-red-700">: ${item.qty * Number(product?.price) * (100 - couponVal?.discount) / 100}</p></div>
                          :
                          <p className="w-full text-left content-center flex items-center text-xs sm:text-[16px]"><span className="flex sm:hidden font-bold mr-3">Total : </span>${item.qty * Number(product?.price)}</p>
                      }
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
                  <div className="w-full mx-auto max-w-[1280]  float-right">
                    <div className="w-full flex items-center justify-center lg:justify-end">
                      
                      <div className="mt-3">
                        {
                          couponVal?.code &&
                          <>
                            <div className="flex space-x-2">
                              <p className="text-[14px] font-semibold">Discount : </p>
                              <p className="text-[14px]"> ${couponVal?.discount} % off (-${(Number(subTotal)*(couponVal?.discount)/(100-couponVal?.discount)).toFixed(2)})</p>
                            </div>
                          </>
                        }
                        <div className="flex space-x-2 mt-6">
                          <p className="text-[14px] font-semibold">Total : </p>
                          <p className="text-[14px] text-red-700"> ${Number(subTotal).toFixed(2)}</p>
                        </div>
                        
                      </div>
                    </div>
                  </div>
        </div>
      </div>
    </main>
  );
}
