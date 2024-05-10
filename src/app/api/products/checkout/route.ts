'use server'
import {NextResponse} from 'next/server';
import supabase from '@/supabase/supabaseClient';
import resend from 'resend';
import { EmailTemplate } from '@/components/EmailTemplate';
import axios from 'axios'

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
async function sendEmail(to, subject, html, apiKey) {
  console.log(subject,html)
  try {
    const response = await axios.post('https://api.resend.com/emails', {
      from: 'Acme <onboarding@resend.dev>', 
      to,
      subject,
      html,
    }, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
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
    deductProductQuantities(cartItems)
      const emailHtml = `
      <h1>Welcome, ${name}!</h1>
      <div style="font-family: Arial, sans-serif; margin: 0; padding: 0;">
        <div style="width: 100%; max-width: 750px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; font-size: 33px; color: #333; margin-bottom:40px;">New contact arrived</div>
          <div style="background-color: #F3EBDD; border-radius: 20px; width:100%; padding: 20px">
            <div style="font-size: 18px; color: #666; margin-top:5px; margin-bottom:5px;">Name: ${name}</div>
            <div style="font-size: 18px; color: #666; margin-top:5px; margin-bottom:5px;">Email: ${email}</div>
            <div style="font-size: 18px; color: #666; margin-top:5px; margin-bottom:5px;">State: ${state}</div>
            <div style="font-size: 18px; color: #666; margin-top:5px; margin-bottom:5px;">City: ${city}</div>
            <div style="font-size: 18px; color: #666; margin-top:5px; margin-bottom:5px;">Address: ${address}</div>
            <div style="font-size: 18px; color: #666; margin-top:5px; margin-bottom:5px;">Phone Number: ${phoneNumber}</div>
            <div style="font-size: 18px; color: #666; margin-top:5px; margin-bottom:5px;">Referral Name: ${refName}</div>
            <div style="font-size: 18px; color: #666; margin-top:5px; margin-bottom:5px;">Referral PhoneNumber: ${refPhoneNumber}</div>
          </div>
          <div style="padding: 35px 0px; width: 100%;">
            <div style="width: 100%; max-width: 400px; margin: 0 auto;">
              <div style="font-size:14px; color: #BC9067; text-align: center">This is a newsletter from the union center.</div>
            </div>
          </div>
        </div>
      </div>
    `;
    const emailData = {
      to: 'simonxmachine@gmail.com',
      subject: 'Please check Transaction',
      html: emailHtml, 
    };
    const apiKey = process.env.EMAIL_API_KEY; 
    const emailResponse = await sendEmail(emailData.to, emailData.subject, emailData.html, apiKey);
    return NextResponse.json("success", {status: 200});
  } catch (error) {
      console.error('Error fetching users:', error);
      return NextResponse.json('NO Auth', {status: 401});
  }
}
