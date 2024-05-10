import { NextResponse } from 'next/server';
import supabase from '@/supabase/supabaseClient';

export async function POST(request: Request, params: { action: string }) {
  const req: { isSuperUser:boolean } = await request.json();
  const isSuperUser = req.isSuperUser;
  try{
    if(isSuperUser){
      const { data, error } = await supabase
        .from('users')
        .select()
        .neq('title', 'super')
        .order('content',{ ascending: false });

      if(error){
        return NextResponse.json(error.message, { status: 401 });
      }else {
        return NextResponse.json(JSON.stringify(data), { status: 200 });
      }

    }else{
      const { data, error } = await supabase
        .from('users')
        .select()
        .contains('content', {isAdmin:false})

      if(error){
        return NextResponse.json(error.message, { status: 401 });
      }else {
        return NextResponse.json(JSON.stringify(data), { status: 200 });
      }
    }
  }catch(error){
    console.error('Error fetching users:', error);
    return NextResponse.json('Error fetching users', { status: 401 });
  }
}
