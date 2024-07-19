'use server'
import {NextResponse} from 'next/server';
import supabase from '@/supabase/supabaseClient';

export async function POST(request : Request, params : {
    action: string
}) {
    const req : {
        productId : string,
        image : string
    } = await request.json();
    const productId = req.productId;
    const image = req.image;

    const {data, error} = await supabase.storage.from('products').remove([image.split('/').pop()]);
    if(error){
        console.error("can't delete file.\n" + error)
    }else{
    }
    try {
        const {error} = await supabase
            .from('products')
            .delete()
            .eq('id', productId);

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
