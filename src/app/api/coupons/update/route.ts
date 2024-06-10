'use server'
import {NextResponse} from 'next/server';
import supabase from '@/supabase/supabaseClient';

export async function POST(request : Request, params : {
  action: string
}) {
  const formData = await request.formData();
  const id = formData.get('id')
  const code = formData.get("code");
  const discount = formData.get("discount");
  
  try {
    const {error} = await supabase
      .from('coupons')
      .update({
        code,
        discount: discount
      })
      .eq("id", id)
    if (error) {
      console.error(error)
      return NextResponse.json(error.details, {status: 401});
    }
    return NextResponse.json("success", {status: 200});
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json('NO Auth', {status: 401});
  }
}
