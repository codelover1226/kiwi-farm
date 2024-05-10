'use server'
import { NextResponse } from 'next/server';
import { createCookie } from '@/app/actions';
import supabase from '@/supabase/supabaseClient';

export async function POST(request: Request, params: { slug: string }) {
  const req: { password: string, isAdmin: boolean } = await request.json();
  const password = req.password;
  const isAdmin  = req.isAdmin;

  try{
    const { data, error } = await supabase
      .from('users')
      .select()
      // .eq("password", password)
      .or(`password.eq.${password}, password1.eq.${password}`)
      
      if(data.length > 0) {
        // if(isAdmin == data[0].content.isAdmin) {
          return NextResponse.json(data[0], { status: 200 });
        // }else{
        //   console.error("You are not allowed");
        //   return NextResponse.json(isAdmin?"You are not admin":"You are not agent", { status: 401 });
        // }
      }else{
        console.error("can't find user");
        return NextResponse.json('NO Auth', { status: 401 });
      }
  }catch(error){
    console.error('Error fetching users:', error);
    return NextResponse.json('NO Auth', { status: 401 });
  }
}
