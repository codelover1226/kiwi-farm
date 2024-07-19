'use server'
import { NextResponse } from 'next/server';
import supabase from '@/supabase/supabaseClient';

export async function POST(request: Request, params: { action: string }) {
  const req: { name: string, password: string, password1: string, isAdmin: boolean } = await request.json();
  const name = req.name;
  const password = req.password;
  const password1 = req.password1;
  const isAdmin  = req.isAdmin;
  try{
    
    const res1 = await supabase
      .from('users')
      .select()
      .eq("password1", password)
    if(res1.data.length > 0){
      return NextResponse.json("Password already used", { status: 401 });
    }

    const res2 = await supabase
      .from('users')
      .select()
      .eq("password", password1)
    if(res2.data.length > 0){
      return NextResponse.json("Password for visitor already used", { status: 401 });
    }
    
    const { error } = await supabase
      .from('users')
      .insert({
        title:name, 
        password, 
        password1, 
        content:{
        isAdmin
      }})

      if(error){
        return NextResponse.json(error.details, { status: 401 });
      }
      return NextResponse.json("success", { status: 200 });
  }catch(error){
    console.error('Error fetching users:', error);
    return NextResponse.json('NO Auth', { status: 401 });
  }
}
