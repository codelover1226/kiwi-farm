"use client";
import React from "react";
import Image from "next/image";
import { useState } from "react";
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { IProduct } from "@/store/features/products/productsAPI";
import { Input } from "./ui/input";
import { useAppSelector } from "@/store/hooks";
import {
  selectIsAdmin,
  selectIsAgency,
  selectIsCart,
} from "@/store/features/auth/authSlice";
import { toast } from "react-hot-toast";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import 'react-quill/dist/quill.snow.css'
import _ from 'lodash';
const HtmlToReactParser = require('html-to-react').Parser;
const HtmlToReact = require('html-to-react');
const htmlToReactParser = new HtmlToReactParser();
const processNodeDefinitions = new HtmlToReact.ProcessNodeDefinitions();

const processingInstructions = [
  {
    shouldProcessNode: function (node) {
      return node.name && node.name === 'h1';
    },
    processNode: function (node, children, index) {
      return React.createElement('h1', {key: index, class:"text-2xl"}, children);
    }
  },
  {
    shouldProcessNode: function (node) {
      return node.name && node.name === 'h2';
    },
    processNode: function (node, children, index) {
      return React.createElement('h2', {key: index, class:"text-xl"}, children);
    }
  },
  {
    shouldProcessNode: function (node) {
      return node.name && node.name === 'h3';
    },
    processNode: function (node, children, index) {
      return React.createElement('h3', {key: index, class:"text-lg"}, children);
    }
  },
  {
    shouldProcessNode: function (node) {
      return node.name && node.name === 'ol';
    },
    processNode: function (node, children, index) {
      return React.createElement('ol', {key: index, class:"pl-10 list-decimal"}, children);
    }
  },
  {
    shouldProcessNode: function (node) {
      return node.name && node.name === 'ul';
    },
    processNode: function (node, children, index) {
      return React.createElement('ul', {key: index, class:"pl-10 list-disc md:list-circle lg:list-square"}, children);
    }
  },
  {
    shouldProcessNode: function (node) {
      return true;
    },
    processNode: processNodeDefinitions.processDefaultNode,
  },
];

import "./user.css";
export interface CartProduct {
  product_id: string,
  flavor_name: string,
  price: number,
  s_price: number,
  s_qty: number,
  qty: number
}

export function ProductCardItem({
    product,
    i,
  }: {
    product: IProduct;
    i: number;
  }) 
{
  const [qty, setQty] = useState<number | null>(null);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [maxQty, setMaxQty] = useState<number | null>(0);
  const cartItems = JSON.parse(localStorage.getItem("cartItems") || "[]");
  const isAdmin = useAppSelector(selectIsAdmin);
  const isAgency = useAppSelector(selectIsAgency);
  const isCart = useAppSelector(selectIsCart);
  const [coupon, setCoupon] = useState(null);
  const [price, setPrice] = useState<number | null >(0);

  let heightCard = React.useMemo(() => {
    if (isAgency || isAdmin || isCart) {
      return `max-w-sm h-[556px] rounded overflow-hidden shadow-lg p-2 hover:bg-accent`;
    } else {
      return `max-w-sm h-[556px] rounded overflow-hidden shadow-lg p-2 hover:bg-accent`;
    }
  }, [isAgency, isAdmin, isCart]);

  const handleChange = (event) => {
    setSelectedOption(event.target.value);
    setMaxQty(product.flavor[event.target.value].qty);
    setPrice(product.flavor[event.target.value].price);
    setCoupon(product.flavor[event.target.value].s_coupon);
    setQty(0);
  };

  const onChange = (event: any) => {
    const value = parseInt(event.target.value, 10);

    if (value > maxQty) {
      setQty(maxQty);
    } else if (value < 1) {
      setQty(0);
    } else {
      setQty(value);
    }
  };

  const addToCart = () => {
    if (selectedOption === null) {
      toast.error("You must select Flavor");
      return;
    }
    const newCartItem: CartProduct = {
      product_id: product.id,
      flavor_name : product.flavor[selectedOption].name,
      price: product.flavor[selectedOption].price,
      s_price: coupon?.price,
      s_qty: coupon?.qty,
      qty: qty,
    };

    cartItems.push(newCartItem);
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
    localStorage.setItem("notification", "true");
    window.dispatchEvent(new Event("storage"));
    toast.success("You just added an item successfully");
  };

  return (
    <div>
      <DialogTrigger>
        <Card className={heightCard} key={"card" + i}>
          <CardHeader className="pb-0">
            <Image
              className="w-full bg-white rounded-full aspect-square object-cover"
              src={product.image}
              alt="grass"
              width={300}
              height={300}
            />
            <CardTitle className="text-xl text-center py-2">
              {product.title}
            </CardTitle>
          </CardHeader>
          <CardContent className='text-xl'>
            <CardDescription className='text-xl text-start font-bold px-4'>
              <div className="text-sm font-normal text-center mt-5">
                {product.tagline}
              </div>
            </CardDescription>
          </CardContent>
        </Card>
      </DialogTrigger>

      {(isAgency || isAdmin || isCart) && (
        <div className="w-full content-center text-center flex-row mt-6">
          <div className="w-[280px] mx-auto flex">
            <p className="content-center mr-[10px]">Flavor :</p>
            <div className="w-[150px]">
              <select
                className="mx-0 w-full bg-white text-sm py-2 my-4 shadow-sm focus-visible:outline-none bg-transparent border-[1px] rounded-md"
                value={selectedOption}
                onChange={handleChange}
              >
                <option value="">Select Option</option>
                {product.flavor &&
                  product.flavor.map((item, index) => (
                    <option key={index} value={index}>
                      {item.name} - ${item.price}
                    </option>
                  ))
                }
              </select>
            </div>
          </div>
          <div className="text-lg flex space-x-2 justify-center place-items-center">
            <div className="flex space-x-3 mx-3">
              <button
                className="bg-green-500 p-0 rounded-sm px-[10px] text-lg font-normal hover:bg-green-400 transition-colors duration-700"
                onClick={() => {
                  if (qty > 1) setQty(qty - 1.0);
                }}
              >
                -
              </button>
              <Input
                className="w-[150px]"
                placeholder="Qty"
                type="number"
                min={0}
                max={maxQty}
                value={qty}
                onChange={onChange}
              ></Input>
              <button
                className="bg-green-500 p-0 px-2 text-lg rounded-sm font-normal hover:bg-green-400 transition-colors duration-700"
                onClick={() => {
                  if (qty < maxQty) setQty(qty + 1.0);
                }}
              >
                +
              </button>
            </div>
          </div>
          <button
            className="w-[150px] bg-green-500 mt-6 p-4 rounded-sm text-lg font-normal hover:bg-green-400 transition-colors duration-700"
            onClick={addToCart}
          >
            Add to cart
          </button>
        </div>
      )}
      <DialogContent className="h-[600px]" style={{ scrollbarWidth: "auto", width: '400px' }}>
        <DialogHeader>
          <DialogTitle className="text-center">{product.title}</DialogTitle>
          <DialogDescription>
            <Image
              className="w-[350px] h-[350px] bg-white rounded-full aspect-square object-cover"
              src={product.image ? product.image : "null"}
              alt="Null"
              width={250}
              height={250}
            />
            <div className="text-sm font-normal text-center mt-5">
              {htmlToReactParser.parseWithInstructions(product.description, ()=>true, processingInstructions)}
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </div>
  );
}