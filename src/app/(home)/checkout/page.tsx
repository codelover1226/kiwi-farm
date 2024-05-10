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

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const newCustomerSchema = z.object({
  name: z.string().min(1, { message: "name is required." }),
  email: z.string().email({ message: "Invalid email address" }),
  phoneNumber: z.string().regex(/^\d{3}-\d{3}-\d{4}$/, { message: "Phone number must be in the format 123-456-7890" }),
  refName: z.string().min(1, { message: "name is required." }),
  refPhoneNumber: z.string().regex(/^\d{3}-\d{3}-\d{4}$/, { message: "Phone number must be in the format 123-456-7890" }),
  state: z.string().min(1, {message: "Please select your state"}),
  city: z.string().min(1, {message: "Please select your city"}),
  address: z.string().min(1, {message: "Please select your address"})
});

export default function About() {
  var today = new Date();
  var time = today.getDay() + "-" + today.getMonth() + "-" + today.getFullYear();
  const [couponCode, setCouponCode] = useState<string | null>("")
  const [isLoading, setIsLoading] = useState(false);
  const [delivery_date, setDeliveryDate] = useState<string | null>(time);
  const [checked, setChecked] = useState(true)
  const products: IProduct[] = useAppSelector(selectProducts);
  const [cartItems, setCartItems] = useState(JSON.parse(localStorage.getItem('cartItems') || '[]'));
  const subtotal = cartItems.reduce((acc, item) => acc + (item.qty * Number(products.find(p => p.id === item.product_id)?.price || 0)), 0);
  
  const router = useRouter();
  const user = useAppSelector(selectUser);
  const dispatch = useAppDispatch();
  const updateProducts = () => {
    dispatch(getProducts({type:"all", user: user.id}));
  }
  useEffect(() => {
    updateProducts();
  }, [])
  const form = useForm<z.infer<typeof newCustomerSchema>>({
    resolver: zodResolver(newCustomerSchema),
    defaultValues: {
      name: "",
      email: "",
      phoneNumber: "",
      refName: "",
      refPhoneNumber: "",
      state: "",
      city: ""
    },
  });
  async function onSubmit(values: z.infer<typeof newCustomerSchema>) {
    console.log("onSubmit");
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
      setIsLoading(true);
      const response = await fetch("/api/products/checkout", {
        method: "POST",
        body: formData,
      });
      if (response.status === 200) {
        updateProducts();
        localStorage.removeItem("cartItems")
        toast.success("You added the new product!.");
        router.push('/thanks')
      } else {
        const error = await response.json();
        toast.error(error);
        console.error(error); 
      }
    } catch (error) {
      toast.error(error.message);
    }
    setIsLoading(false);
  }
  const onCouponChange = (event: any) => {
    setCouponCode(event.target.value)
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
                  <div className="w-full">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem className="flex w-full justify-center gap-3">
                          <FormLabel className="min-w-[90px] max-w-[100px] self-center ">
                            Name :
                          </FormLabel>
                          <FormControl
                            className="w-8/12 sm:w-full min-w-[128px]  "
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
                        <FormItem className="flex w-full justify-center gap-3">
                          <FormLabel className="min-w-[90px] max-w-[100px] self-center ">
                            Email :
                          </FormLabel>
                          <FormControl
                            className="w-8/12 sm:w-full min-w-[128px]  "
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
                        <FormItem className="flex w-full justify-center gap-3">
                          <FormLabel className="min-w-[90px] max-w-[100px] self-center ">
                            State :
                          </FormLabel>
                          <FormControl
                            className="w-8/12 sm:w-full min-w-[128px]  "
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
                        <FormItem className="flex w-full justify-center gap-3">
                          <FormLabel className="min-w-[90px] max-w-[100px] self-center ">
                            City :
                          </FormLabel>
                          <FormControl
                            className="w-8/12 sm:w-full min-w-[128px]  "
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
                        <FormItem className="flex w-full justify-center gap-3">
                          <FormLabel className="min-w-[90px] max-w-[100px] self-center ">
                            Address :
                          </FormLabel>
                          <FormControl
                            className="w-8/12 sm:w-full min-w-[128px]  "
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
                        <FormItem className="flex w-full justify-center gap-3">
                          <FormLabel className="min-w-[90px] max-w-[100px] self-center ">
                            Phone Number :
                          </FormLabel>
                          <FormControl
                            className="w-8/12 sm:w-full min-w-[128px]  "
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
                        <FormItem className="flex w-full justify-center gap-3">
                          <FormLabel className="min-w-[90px] max-w-[100px] self-center ">
                            Referral Name:
                          </FormLabel>
                          <FormControl
                            className="w-8/12 sm:w-full min-w-[128px]  "
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
                        <FormItem className="flex w-full justify-center gap-3">
                          <FormLabel className="min-w-[90px] max-w-[100px] self-center ">
                            Referral  Phone :
                          </FormLabel>
                          <FormControl
                            className="w-8/12 sm:w-full min-w-[128px]  "
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
                      onChange={(event:any) => {setDeliveryDate(event.target.value), console.log(delivery_date)}}
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
            <div className="w-full flex border-b-[1px] border-gray-300 pb-3 mx-auto mt-6">
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
            <div className="w-full flex items-center justify-center lg:justify-end">
              <div className="space-y-3 mt-3">
                <div className="flex">
                  <p className="text-lg font-semibold">Total : </p>
                  <p className="text-lg font-semibold"> $ {subtotal.toFixed(2)}</p>
                </div>
              </div>
            </div>
            <div className="w-full flex">
              <div className="w-full">
                <Input
                  maxLength={10}
                  className="bg-white mt-0"
                  placeholder="Your Coupon Code"
                  value={couponCode}
                  onChange={onCouponChange}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
