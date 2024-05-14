'use server'
import {NextResponse} from 'next/server';
import supabase from '@/supabase/supabaseClient';

export async function POST(request : Request, params : {
    action: string
}) {
    const req : {
      id : string
    } = await request.json();
    const id = req.id;
    try {
      const {error} = await supabase
        .from('coupons')
        .delete()
        .eq('id', id);

      if (error) {
          return NextResponse.json(error.message, {status: 401});
      } else {
          return NextResponse.json("success", {status: 200});
      }
    } catch (error) {
        console.error('Error fetching users:', error);
        return NextResponse.json('Error fetching users', {status: 401});
    }
}
