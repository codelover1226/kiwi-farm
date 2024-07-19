'use server'
import {NextResponse} from 'next/server';
import supabase from '@/supabase/supabaseClient';

export async function POST(request : Request, params : {  action: string }) {
  const formData = await request.formData();
  const id = formData.get('id');
  try {
    if (id == "all") {
      const {data, error} = await supabase
        .from('coupons')
        .select()
        .order('id', {ascending: true});
      if (error) {
        return NextResponse.json(error.message, {status: 401});
      } else {
        return NextResponse.json(JSON.stringify(data), {status: 200});
      }

    } else {
      const {data , error} = await supabase
        .from('coupons')
        .select()
        .eq('id', id)
        .order('code', {ascending: true});
      if (error) {
        return NextResponse.json(error.message, {status: 401});
      } else {
        return NextResponse.json(JSON.stringify(data), {status: 200});
      }
    }
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json('NO Auth', {status: 401});
  }
}
