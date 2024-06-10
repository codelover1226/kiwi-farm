import { JsonObject } from "type-fest";

export interface IProduct {
  id: string;
  title: string;
  slug: string;
  price: string;
  description: string;
  content: JsonObject;
  image: string;
  type: string;
  user_id: string;
  quantity: string;
  flavor: [{
    name: string,
    qty: number
  }];
  s_coupon: {
    price: number,
    qty: number
  };
}

export const fetchProducts = async ({type, user}:{type:string, user:string}) => {
  try {
    const response = await fetch("/api/products/get", {
      method: "POST",
      body: JSON.stringify({ type, user }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.ok) {
      const data: IProduct[] = await response.json();
      return {isSuccess:true, data}
    } else {
      const data = await response.json();
      return {isSuccess:false, data}      
    }
  } catch (error) {
    return {isSuccess:false, data:error.message}      
  }
};
