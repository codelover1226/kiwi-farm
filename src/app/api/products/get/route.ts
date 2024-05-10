'use server'
import {NextResponse} from 'next/server';
import supabase from '@/supabase/supabaseClient';

export async function POST(request : Request, params : {
    action: string
}) {
    const req : {
        type : string,
        user : string
    } = await request.json();
    const reqType = req.type;
    const reqUser = req.user;
    // console.log(req)
    try {
        if (reqType == "all") {
            const {data, error} = await supabase
                .from('products')
                .select()
                .eq('user_id', reqUser)
                .order('title', {ascending: true});

            if (error) {
                return NextResponse.json(error.message, {status: 401});
            } else {
                return NextResponse.json(JSON.stringify(data), {status: 200});
            }

        } else if (reqUser == "all") {
            const {data , error} = await supabase
                .from('products')
                .select()
                // .eq('type', reqData)
                // .select("*, users(id, title)")
                // .contains('user', {title:"super"})
                .eq('type', reqType)
                .order('title', {ascending: true});
                // .match({'type': reqData, "user_id":12})
                // console.log("data")
                // console.log(data)
                // .match({'type': reqData, "user_id": 12})

            if (error) {
                return NextResponse.json(error.message, {status: 401});
            } else {
                return NextResponse.json(JSON.stringify(data), {status: 200});
            }
        }else {
            const {data , error} = await supabase
                .from('products')
                .select()
                .eq('type', reqType)
                .match({'type': reqType, "user_id":reqUser})
                .order('title', {ascending: true});

            if (error) {
                return NextResponse.json(error.message, {status: 401});
            } else {
                return NextResponse.json(JSON.stringify(data), {status: 200});
            }
        }

        return NextResponse.json("can't find vaild data", {status: 401});
    } catch (error) {
        console.error('Error fetching users:', error);
        return NextResponse.json('NO Auth', {status: 401});
    }
}
