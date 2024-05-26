"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { forwardRef, useState, useEffect } from "react";
import * as Select from '@radix-ui/react-select';
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from '@radix-ui/react-icons';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { selectProducts } from "@/store/features/products/productsSlice";
import { getProducts } from "@/store/features/products/productsSlice";
import _ from 'lodash';

import classnames from 'classnames';

const newCouponSchema = z.object({
  code: z.string().min(1, { message: "Code is required." }),
  discount: z.number().min(0, { message: "quantity must be over 0." }),
});

export interface ICoupons {
  id: string;
  code: string;
  product: Array<{product: string, discount: number}>;
}

interface SelectDemoProps {
  value: string; 
  onValueChange: (value: string) => void; 
  coupons: ICoupons[],
}

const SelectDemo: React.FC<SelectDemoProps> = ({value, onValueChange, coupons}) => (
  <Select.Root value={value} onValueChange={onValueChange}>
    <Select.Trigger
      className="inline-flex items-center justify-between w-full rounded px-[15px] text-[13px] leading-none h-full gap-[5px] bg-white text-violet11 shadow-[0_2px_10px] shadow-black/10 hover:bg-mauve3 focus:shadow-[0_0_0_2px] focus:shadow-black data-[placeholder]:text-violet9 outline-none"
      aria-label="Food"
    >
      <Select.Value placeholder="Select an item…" />
      <Select.Icon className="text-violet11">
        <ChevronDownIcon />
      </Select.Icon>
    </Select.Trigger>
    <Select.Portal>
      <Select.Content className="z-50 overflow-hidden bg-white rounded-md shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)]">
        <Select.ScrollUpButton className="flex items-start justify-start h-2 bg-white text-violet11 cursor-default">
          <ChevronUpIcon />
        </Select.ScrollUpButton>
        <Select.Viewport className="p-[5px] ">
          <Select.Group className="">
          <SelectItem key={"coupons-1"} value={"-1"} className=" text-3xl font-bold text-green-600">* NEW</SelectItem>
            {coupons.map((coupon, index) => {  
              return (
              <SelectItem key={"coupons" + index} value={String(index)}>{coupon.code} - {coupon.discount}</SelectItem>
            )})}
          </Select.Group>
        </Select.Viewport>
        <Select.ScrollDownButton className="flex items-center justify-center h-2 bg-white text-violet11 cursor-default">
          <ChevronDownIcon />
        </Select.ScrollDownButton>
      </Select.Content>
    </Select.Portal>
  </Select.Root>
);
interface SelectItemProps extends React.ComponentPropsWithoutRef<typeof Select.Item> {
  value: string;
}

const SelectItem = forwardRef<HTMLDivElement, SelectItemProps>(({ children, className, ...props }, forwardedRef) => {
  return (
    <Select.Item
      className={classnames(
        'text-[13px] leading-none text-violet11 rounded-[3px] flex items-center h-[25px] pr-[35px] pl-[25px] relative select-none data-[disabled]:text-mauve8 data-[disabled]:pointer-events-none data-[highlighted]:outline-none data-[highlighted]:bg-violet9 data-[highlighted]:text-violet1',
        className
      )}
      {...props}
      ref={forwardedRef}
    >
      <Select.ItemText>{children}</Select.ItemText>
      <Select.ItemIndicator className="absolute left-0 w-[25px] inline-flex items-center justify-center">
        <CheckIcon />
      </Select.ItemIndicator>
    </Select.Item>
  );
});

export default function Home(){
  const [coupons, setCoupons] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedCoupon, setSelectedCoupon] = useState<string | null>('-1')
  const [id, setId] = useState<string | null>("all")
  const [selectedProduct, setSelectedProduct] = useState<string | null>("");
  const dispatch = useAppDispatch();
  dispatch(getProducts({ type: "all", user: 'all' }));
  const products = useAppSelector(selectProducts);

  const getCoupons = async (id: string) => {
    try {
      const formData = new FormData();
      formData.append('id', id);
      const response = await fetch("/api/coupons/get", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setCoupons(JSON.parse(data));
      } else {
        const error = await response.json();
        toast.error(error);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    
    getCoupons("all");
  }, []);

  const form = useForm<z.infer<typeof newCouponSchema>>({
    resolver: zodResolver(newCouponSchema),
    defaultValues: {
      code: "",
      discount: 0,
    },
  });

  const handleChange = (event: any) => {
    setSelectedProduct(event.target.value);
    let temp = coupons[selectedCoupon];
    let product = temp?.product.findIndex(p=> p.product === event.target.value);
    if (product !== -1) {
      form.setValue('discount', Number(temp?.product[product].discount || 0));
    }else{
      form.setValue('discount', 0);
    }
  }

  async function onSubmit(values: z.infer<typeof newCouponSchema>){
    try {
      const formData = new FormData();
      for (const key in values) {
        if (Object.prototype.hasOwnProperty.call(values, key)) {
          const value = values[key];
          formData.append(key, value);
        }
      }
      setIsLoading(true);
      if (selectedCoupon == "-1") {
        formData.append("product", JSON.stringify({product: selectedProduct, discount: form.getValues("discount")}));
        const response = await fetch("/api/coupons/insert", {
          method: "POST",
          body: formData,
        });
        if (response.status === 200) {
          toast.success("You added the new product!.");
          getCoupons("all");
        } else {
          const error = await response.json();
          toast.error(error);
        }
      } 
      else {
        formData.append("id", coupons[id].id);
        let cProduct = _.cloneDeep(coupons.find(p=> p.id === coupons[id].id));
        let temp = cProduct.product;
        let temp_product = temp.findIndex(p=> p.product === selectedProduct);
        if (temp_product !== -1) {
          temp[temp_product].discount = form.getValues("discount");
        }else{
          temp.push({product: selectedProduct, discount: form.getValues("discount")})
        }
        formData.append("product", JSON.stringify(temp));
        const response = await fetch("/api/coupons/update", {
          method: "POST",
          body: formData,
        });
        if (response.status === 200) {
          toast.success("You update the current coupon!.");
          getCoupons("all");
        } else {
          const error = await response.json();
          toast.error(error);
        }
      }
    } catch (error) {
      toast.error(error.message);
    }
    setIsLoading(false);
  }

  const discountChange = (event: any) =>{
    const value = parseInt(event.target.value);
    if (value < 0 || value > 100) {
      return;
    }
    form.setValue("discount", value);
  }

  const handleInputChange = (e : any) => {
    setSelectedCoupon(e)
    if(e === '-1'){
      form.setValue("code", "")
      setId("")
      return
    }
    setId(e);
    form.setValue("code", coupons[e].code);
  }

  async function handleDelete(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    try {
      if(selectedCoupon == "-1"){
        toast.error('Please select correct item.');
        return
      }
      const response = await fetch("/api/coupons/delete", {
        method: "POST",
        body: JSON.stringify({id: coupons[id].id}),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if(response.ok) {
        toast.success('You deleted the coupon!.');
        form.setValue("code", "")
        form.setValue("discount", 0)
        setId("")
        getCoupons("all");
      }else{
        const unit8 = (await response.body.getReader().read()).value;
        const msg = Buffer.from(unit8).toString();
        toast.error('Failed to delete coupon\n' + msg);
      }
    } catch (error) {
        toast.error(error.message);
    }
  }

  return(
    <div className="">
      <h2 className="text-2xl py-3 self-center text-center">Manage Coupons</h2>
      <div className="flex flex-row flex-wrap bg-accent rounded-sm p-6 justify-evenly sm:gap-6 gap-4 max-w-[900px] mx-auto mt-6">
        <div className="max-w-[600px] mx-auto px-2">
          <div className="w-full flex my-6">
            <div className="flex space-x-3 mx-auto">
              <div className="min-w-[150px]">
                <SelectDemo value={selectedCoupon} onValueChange={handleInputChange} coupons={coupons}/>
              </div>
              <div className="">
                <Button
                  className="bg-[#ee4848] hover:bg-[#f85d5d] w-32 h-9 "
                  onClick={handleDelete}
                >
                  Delete
                </Button>
              </div>
            </div>
          </div>
          <div>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="flex flex-grow md:flex-row flex-wrap text-left  items-center gap-2 px-6 space-y-4">
                  <div className="mt-0 w-full min-w-[128px]">
                    <FormField
                      control={form.control}
                      name="code"
                      render={({ field }) => (
                        <FormItem className="flex w-full flex-wrap justify-center gap-3">
                          <FormLabel className="w-4/12 min-w-[90px] max-w-[100px] self-center ">
                            Code :
                          </FormLabel>
                          <FormControl
                            className="w-8/12 sm:w-6/12 min-w-[128px] max-w-[350px] "
                            style={{
                              marginTop: 0,
                            }}
                          >
                            <div>
                              <Input
                                maxLength={40}
                                className="bg-white mt-0"
                                placeholder="Input Code"
                                {...field}
                              />
                              <FormMessage className="absolute" />
                            </div>
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="mt-0 w-full min-w-[128px]">
                    <FormField
                      control={form.control}
                      name="discount"
                      render={({ field }) => (
                        <FormItem className="flex w-full flex-wrap justify-center gap-3">
                          <FormLabel className="w-4/12 min-w-[90px] max-w-[100px] self-center ">
                            Special Deal Rules :
                          </FormLabel>
                          <FormControl
                            className="w-8/12 sm:w-6/12 min-w-[128px] max-w-[350px] "
                            style={{
                              marginTop: 0,
                            }}
                          >
                            <div>
                              <select 
                                className='mx-0 w-full bg-white text-sm py-2 my-4 shadow-sm focus-visible:outline-none bg-transparent border-[1px] rounded-md' 
                                value={selectedProduct} 
                                onChange={handleChange}
                                >
                                <option value="" disabled>Select Product</option>
                                {products.map((item, index) => (
                                  <option key={index} value={item.id}>{item.title}</option>
                                ))}
                              </select>
                              <FormMessage className="absolute" />
                            </div>
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="mt-0 w-full min-w-[128px]">
                    <FormField
                      control={form.control}
                      name="discount"
                      render={({ field }) => (
                        <FormItem className="flex w-full flex-wrap justify-center gap-3">
                          <FormLabel className="w-4/12 min-w-[90px] max-w-[100px] self-center ">
                            Discount :
                          </FormLabel>
                          <FormControl
                            className="w-8/12 sm:w-6/12 min-w-[128px] max-w-[350px] "
                            style={{
                              marginTop: 0,
                            }}
                          >
                            <div>
                              <Input
                                type="number"
                                min={0}
                                max={100}
                                className="bg-white mt-0"
                                onChange={discountChange}
                                value={field.value}
                              />
                              <FormMessage className="absolute" />
                            </div>
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                  <input type="hidden" value={id}>
                  </input>
                  <div className="w-full text-center">
                    <Button
                      className={"bg-[#017c6b] hover:bg-[#009688] w-32 h-12 mt-2 "}
                      type="submit"
                      disabled={isLoading}
                    >
                      {selectedCoupon == "-1" ? "Add" : "Update"}
                    </Button>
                  </div>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </div>
  )
}