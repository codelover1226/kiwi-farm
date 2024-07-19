import {NextResponse, NextRequest} from 'next/server';
import supabase from '@/supabase/supabaseClient';

export async function POST(req : Request) {
  try {
    const formData = await req.formData();
    const code = formData.get("code");
    const discount = formData.get("discount");
    try {
      const {data, error} = await supabase
       .from('coupons')
       .insert({
          code,
          discount: discount
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