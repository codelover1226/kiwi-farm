"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import CurrencyInput from "react-currency-input-field";
import Image from "next/image";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import _ from 'lodash';
import { Input } from "@/components/ui/input";
import { toast } from "react-hot-toast";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { selectUser } from "@/store/features/auth/authSlice";
import {
  getProducts,
  selectProduct,
  selectProducts,
  setSelectedProduct,
} from "@/store/features/products/productsSlice";
import { CustomSelect } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import React, { forwardRef } from "react";
import { JsonObject } from "type-fest";
import { selectIsAgency, selectIsAdmin } from "@/store/features/auth/authSlice";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import 'react-quill/dist/quill.snow.css'
import dynamic from 'next/dynamic';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
const HtmlToReactParser = require('html-to-react').Parser;
const htmlToReactParser = new HtmlToReactParser();
const HtmlToReact = require('html-to-react');
const processNodeDefinitions = new HtmlToReact.ProcessNodeDefinitions();

const types = ["flower", "edible", "extract", "pre-role", "miscellaneous"];

export const newProductSchema = z.object({
  title: z.string().min(1, { message: "title is required." }),
  slug: z.string().min(1, { message: "slug is required." }),
  tagline: z.string().min(1, { message: "tagline is required." }),
  description: z.string().min(1, { message: "description is required." }),
  image: z.string(),
  type: z.string().min(1, { message: "type is required." }),
});

export type TNewProductSchema = z.infer<typeof newProductSchema>;

export function NewProductForm() {
  const router = useRouter();
  const baseUrl = `${window.location.protocol}//${window.location.host}`;
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const selectedProduct = useAppSelector(selectProduct);
  const products = useAppSelector(selectProducts);
  const [imgFileName, setImgFileName] = useState("");
  const [imgFile, setImgFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [flavor, setFlavor] = useState([]);
  const [flavor_name, setFlavorName] = useState('');
  const [flavor_qty, setFlavorQty] = useState(0);
  const [price, setPrice] = useState<number | 0>(0);

  
  useEffect(() => {
    console.log("OKOKOK--->>>");
    if (selectedProduct == "-1") {
      form.reset();
      setFlavor([]);
      setPreviewUrl("");
      setImgFile(null);
      return;
    }
    const product = products[Number(selectedProduct)];
    if (!product) {
      dispatch(setSelectedProduct("-1"));
      return;
    }
    // alert(product.tagline);
    form.setValue("title", product.title);
    form.setValue("slug", product.slug);
    form.setValue("tagline", product.tagline === null ? "" : product.tagline);
    form.setValue("description", product.description);
    form.setValue("type", product.type);
    form.setValue("image", product.image);
    setFlavor(Array.isArray(product.flavor)? product.flavor : []);

    if (product.image) {
      setPreviewUrl(`${product.image}`);
    } else {
      setPreviewUrl("");
    }
    setImgFileName("");
    setImgFile(null);
  }, [selectedProduct]);

  const form = useForm<z.infer<typeof newProductSchema>>({
    resolver: zodResolver(newProductSchema),
    defaultValues: {
      title: "",
      slug: "slug",
      tagline: "",
      description: "",
      image: "",
      type: "flower"
    },
  });

  async function onSubmit(values: z.infer<typeof newProductSchema>) {
    try {
      const formData = new FormData();
      formData.append("imgFile", imgFile);
      for (const key in values) {
        if (Object.prototype.hasOwnProperty.call(values, key)) {
          const value = values[key];
          formData.append(key, value);
        }
      }
      formData.append("flavor", JSON.stringify(flavor));
      formData.append("user_id", user.id);
      setIsLoading(true);
      if (selectedProduct == "-1") {
        const response = await fetch("/api/products/insert", {
          method: "POST",
          body: formData,
        });
        if (response.status === 200) {
          toast.success("You added the new product!");
          form.setValue("title", "");
          form.setValue("slug", "");
          form.setValue("description", "");
          form.setValue("tagline", "");
          form.setValue("type", null);
          form.setValue("image", "");
          setFlavor([]);
          setImgFileName("");
          setPreviewUrl("");
          setPrice(0);
          dispatch(getProducts({ type: "all", user: user.id }));
        } else {
          const error = await response.json();
          toast.error(error);
          console.error(error); 
        }
      } else {
        formData.append("id", products[Number(selectedProduct)].id);
        const response = await fetch("/api/products/update", {
          method: "POST",
          body: formData,
        });
        if (response.status === 200) {
          toast.success("You update the current product!.");
          dispatch(getProducts({ type: "all", user: user.id }));
        } else {
          const error = await response.json();
          toast.error(error);
          console.error(error);
        }
      }
    } catch (error) {
      toast.error(error.message);
      console.error(error);
    }
    setIsLoading(false);
  }

  const handleChangeType = (type: string) => {
    form.setValue("type", type);
  };
  const handleChangeImage = (event: any) => {
    if (event.target.files.length > 0) {
      const imgUrl = URL.createObjectURL(event.target.files[0]);
      setImgFile(event.target.files[0]);
      setPreviewUrl(imgUrl);
      setImgFileName(event.target.value);
    } else {
      setImgFile(null);
      setPreviewUrl("");
      setImgFileName("");
    }
  };

  const handleChangePrice = ({
    value,
    name,
    values,
  }: {
    value: string;
    name: string;
    values: any;
  }) => {
    setPrice(Number(value));
  };
  const handleInputChange = (event: any) => {
    const target = event.target;
    const value = target.type === 'number'? Number(target.value) : target.value;
  
    if (target.id === 'fn') {
      setFlavorName(value);
    } else if (target.id === 'qty') {
      if(value < 0){setFlavorQty (0)}
      setFlavorQty(value);
    }
  };
  const handleInsert = (event: any) => {
    event.preventDefault();
    if(event.target.id === 'flav_add'){
      if (!flavor_name){
        toast.error("input correctly")
        return
      }
      if (!flavor_qty === null){
        toast.error("Input correctly")
        return
      }
      const newFlavor = {
        name: flavor_name,
        qty: flavor_qty,
        price: price
      };
    
      setFlavor([...flavor, newFlavor]);
    
      setFlavorName('');
      setPrice(0);
      setFlavorQty(0);
    }
  };

  const handleFlavorDelete = (event: any, indexToDelete: number) => {
    event.preventDefault()
    setFlavor(prevFlavor => {
      const newFlavor = prevFlavor.filter((_, index) => index!== indexToDelete);
      return newFlavor;
    });
  };  

  const handleUpdateFlavor = (key, id, value) => {
    let temp = _.cloneDeep(flavor);
    temp[key][id] = value;
    setFlavor(temp);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex py-5 mb-0 justify-center lg:px-20 xl:px-40">
        <div className="flex flex-grow md:flex-row flex-wrap text-left items-center gap-2 px-6">
          <div className="flex flex-row flex-wrap bg-accent rounded-sm p-6 justify-evenly sm:gap-6 gap-4">
            <div className="mt-0 w-full min-w-[128px]">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem className="flex w-full flex-wrap justify-center gap-3">
                    <FormLabel className="w-4/12 min-w-[90px] max-w-[100px] self-center ">
                      Name :
                    </FormLabel>
                    <FormControl
                      className="w-full sm:w-3/4 min-w-[128px] max-w-[400px] "
                      style={{
                        marginTop: 0,
                      }}
                    >
                      <div>
                        <Input
                          maxLength={40}
                          className="bg-white mt-0"
                          placeholder="Name"
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
                name="tagline"
                render={({ field }) => (
                  <FormItem className="flex w-full flex-wrap justify-center gap-3">
                    <FormLabel className="w-4/12 min-w-[90px] max-w-[100px] self-center ">
                      Tagline :
                    </FormLabel>
                    <FormControl
                      className="w-full sm:w-3/4 min-w-[128px] max-w-[400px] "
                      style={{
                        marginTop: 0,
                      }}
                    >
                      <div>
                        <Input
                          maxLength={40}
                          className="bg-white mt-0"
                          placeholder="Tagline"
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
                name="description"
                render={({ field }) => (
                  <FormItem className="flex w-full flex-wrap justify-center gap-3">
                    <FormLabel className="w-4/12 min-w-[90px] max-w-[100px] self-center ">
                      Description :
                    </FormLabel>
                    <FormControl
                      className="w-full sm:w-3/4 min-w-[128px] max-w-[400px] "
                      style={{
                        marginTop: 0,
                      }}
                    >
                      <div className="bg-white">
                        <ReactQuill
                          theme='snow'
                          // value={convertedText}
                          className="w-full border-none"
                          style={{minHeight: '250px', maxHeight: '350px'}}
                          {...field}
                        />
                        {/* <textarea
                          className="bg-white mt-0 w-full p-3"
                          placeholder="Description"
                          {...field}
                        /> */}
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
                name="type"
                render={({ field }) => (
                  <FormItem className="flex w-full flex-wrap justify-center gap-3">
                    <FormLabel className="w-4/12 min-w-[90px] max-w-[100px] self-center ">
                      Type :
                    </FormLabel>
                    <FormControl
                      className="w-full sm:w-3/4 min-w-[128px] max-w-[400px] "
                      style={{
                        marginTop: 0,
                      }}
                    >
                      <div className="">
                        {/* <Input maxLength={40} className="bg-white mt-0" placeholder="Type" {...field}/> */}
                        <CustomSelect
                          value={field.value}
                          onValueChange={handleChangeType}
                          values={types}
                          placeholder={"Type"}
                          className={"h-9"}
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
                name="image"
                render={({ field }) => {
                  return (
                    <FormItem className="flex w-full flex-wrap justify-center gap-3">
                      <FormLabel className="w-4/12 min-w-[90px] max-w-[100px] self-center ">
                        Image :
                      </FormLabel>
                      <FormControl
                        className="w-full sm:w-3/4 min-w-[128px] max-w-[400px] "
                        style={{
                          marginTop: 0,
                        }}
                      >
                        <div>
                          <Input
                            type="file"
                            className="bg-white mt-0"
                            placeholder="Image"
                            onChange={handleChangeImage}
                            value={imgFileName}
                            accept="image/*"
                          />
                          <FormMessage className="absolute" />
                          {previewUrl && (
                            <Image
                              src={previewUrl}
                              alt={previewUrl.split("/").pop()}
                              width={500}
                              height={100}
                            />
                          )}
                        </div>
                      </FormControl>
                    </FormItem>
                  );
                }}
              />
            </div>
            <div className="mt-0 w-full min-w-[128px]">
              <div className="space-y-2 flex w-full flex-wrap justify-center gap-3">
                <FormLabel className="w-4/12 min-w-[90px] max-w-[100px] self-center ">
                  Flavor :
                </FormLabel>
                <div className="w-full sm:w-3/4 min-w-[128px] max-w-[400px] flex space-x-1">
                  <Input
                    type="text"
                    className="bg-white mt-0 sm:w-full w-full"
                    placeholder="Flavor"
                    value={flavor_name}
                    onChange={handleInputChange}
                    id="fn"
                  />
                  <FormField
                    name="price"
                    render={({ field }) => (
                      <div className="flex w-full sm:w-[60px] flex-wrap justify-center">
                        <div
                          className="w-full sm:w-[60px]"
                          style={{
                            marginTop: 0,
                          }}
                        >
                          <div>
                            <CurrencyInput
                              placeholder="Please enter a number"
                              defaultValue={0}
                              decimalsLimit={2}
                              value={Number.isNaN(field.value)? 0: field.value}
                              prefix="$"
                              className="flex h-9 w-full rounded-md border border-input text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 bg-white mt-0"
                              onValueChange={(value, name, values) =>
                                handleChangePrice({ value, name, values })
                              }
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  />
                  <Input
                    type="number"
                    className="bg-white mt-0 w-full sm:w-[60px]"
                    placeholder="Qty"
                    value={flavor_qty}
                    min={0}
                    onChange={handleInputChange}
                    id="qty"
                  />
                  <Button
                    className="bg-white text-black hover:bg-[#ffffef]"
                    id="flav_add"
                    onClick={handleInsert}
                  >
                    +
                  </Button>
                  <FormMessage className="absolute" />
                </div>
              </div>
              <div className="space-y-2 flex w-full flex-wrap justify-center gap-3">
                {
                  Array.isArray(flavor) && flavor.length>0 ?<FormLabel className="w-4/12 min-w-[90px] max-w-[100px] self-center h-full">
                  Flavor List :
                </FormLabel> : <></>
                }
                
                <div className="w-full sm:w-3/4 min-w-[128px] max-w-[400px]">
                  {Array.isArray(flavor) && flavor.map((item, index) => (
                    <div key={index} className="min-w-[128px] max-w-[400px] flex space-x-1 my-2">
                      <Input
                        type="text"
                        className="bg-white mt-0 sm:w-full w-full"
                        placeholder="Flavor"
                        value={flavor[index].name}
                        onChange={(e)=> handleUpdateFlavor(index, e.target.id, e.target.value)}
                        id="name"
                      />
                      <Input
                        type="number"
                        className="flex w-full sm:w-[60px] flex-wrap justify-center"
                        placeholder="Qty"
                        value={flavor[index].price}
                        min={0}
                        onChange={(e)=> handleUpdateFlavor(index, e.target.id, e.target.value)}
                        id="price"
                      />
                      <Input
                        type="number"
                        className="bg-white mt-0 w-full sm:w-[60px]"
                        placeholder="Qty"
                        value={flavor[index].qty}
                        min={0}
                        onChange={(e)=> handleUpdateFlavor(index, e.target.id, e.target.value)}
                        id="qty"
                      />
                      <Button
                        className="bg-white text-black hover:bg-[#ffffef]"
                        id="flav_delete"
                        onClick={(e) => handleFlavorDelete(e, index)}
                      >
                        -
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-3 w-[128px]">
              <Button
                className={"bg-[#017c6b] hover:bg-[#009688] w-32 h-12 mt-2 "}
                type="submit"
                disabled={isLoading}
              >
                {selectedProduct == "-1" ? "Add" : "Update"}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </Form>
  );
}
