'use server'
import {NextResponse} from 'next/server';
import supabase from '@/supabase/supabaseClient';

export async function POST(request : Request, params : {  action: string }) {
  const formData = await request.formData();
  const code = formData.get('code');
  try {
    const {data , error} = await supabase
      .from('coupons')
      .select()
      .eq('code', code)
      .order('code', {ascending: true});
    if (data[0]) {
      return NextResponse.json(JSON.stringify(data), {status: 200});
    } else {
      return NextResponse.json(error.message, {status: 401});
    }
  } catch (error) {
    return NextResponse.json('NO Auth', {status: 401});
  }
}
