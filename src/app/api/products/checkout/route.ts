'use server'
import {NextResponse} from 'next/server';
import supabase from '@/supabase/supabaseClient';

async function deductProductQuantities(cartItems) {
  const products = await getItems();

  try {
    for (const item of cartItems) {
      const product = products.find(p => p.id === item.product_id);
      console.log(product.quantity - item.qty)
      if (product.quantity < item.qty){
        return NextResponse.json("Products are not enough.")
      }
      if (!product) continue; 
      const { error } = await supabase
       .from('product')
       .update({ quantity: product.quantity - item.qty })
       .match({ id: product.id });

      if (error) throw error;
    }
  } catch (error) {
    console.error('Error updating product quantities:', error);
    return NextResponse.json('Error updating product quantities', { status: 500 });
  }
}
async function getItems() {
  try {
    const { data, error } = await supabase.from('product').select('*');
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}
export async function POST(request : Request, params : {
  action: string
}) {
  const formData = await request.formData();
  const name = formData.get("name")
  const email = formData.get("email")
  const state = formData.get("state")
  const city = formData.get("city")
  const address = formData.get("address")
  const phoneNumber = formData.get("phoneNumber")
  const refName = formData.get("refName")
  const refPhoneNumber = formData.get("refPhoneNumber")
  const cartItemsString = formData.get("cartItems");
  const cartItems = cartItemsString? JSON.parse(cartItemsString as string) : null
  const deliveryDate = formData.get("delivery_date")
  deductProductQuantities(cartItems)
  try {
    const {error} = await supabase
      .from('customer')
      .insert({
          name,
          email,
          state,
          city,
          address,
          phoneNumber,
          refName,
          refPhoneNumber,
          cartItems,
          deliveryDate
      })

    if (error) {
      return NextResponse.json(error.details, {status: 401});
    }
    return NextResponse.json("success", {status: 200});
  } catch (error) {
      console.error('Error fetching users:', error);
      return NextResponse.json('NO Auth', {status: 401});
  }
}
