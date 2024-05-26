'use server'
import {NextResponse} from 'next/server';
import supabase from '@/supabase/supabaseClient';

export async function POST(request : Request, params : {
    action: string
}) {
    const req = await request.json();
    let temp = {};
    Object.keys(req).forEach(k=> {
        if (k === 'id') {
            return;
        }
        temp[k] = req[k];
    });
    try {
        const {error} = await supabase
            .from('users')
            .update(temp)
            .eq('id', req.id);

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
