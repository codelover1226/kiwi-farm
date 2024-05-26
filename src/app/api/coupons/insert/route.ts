import {NextResponse, NextRequest} from 'next/server';
import supabase from '@/supabase/supabaseClient';

export async function POST(req : Request) {
  console.log(req)
  try {
    const formData = await req.formData();
    const code = formData.get("code");
    let temp = [];
    const product = JSON.parse(String(formData.get("product")));
    temp.push(product);
    try {
      const {data, error} = await supabase
       .from('coupons')
       .insert({
          code,
          product: temp
        });

      if (error) {
        console.error('Supabase error:', error);
        return NextResponse.json(error.details, {status: 401});
      }
      return NextResponse.json('success', {status: 200});
    } catch (error) {
      console.error('Error inserting product:', error);
      return NextResponse.json('Error inserting product:', {status: 500});
    }
  } catch (error) {
    console.error('Error handling request:', error);
    return NextResponse.json('Error handling request:', {status: 500});
  }
}