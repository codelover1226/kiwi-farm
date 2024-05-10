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
    // require('fs').unlink(process.cwd() + "/public" + image, (err) => {
    //     if (err) {
    //         console.error('Error deleting file:', err);
    //         return;
    //     }
    //     console.log('File deleted successfully');
    // });
    const {data, error} = await supabase.storage.from('products').remove([image.split('/').pop()]);
    if(error){
        console.error("can't delete file.\n" + error)
    }else{
        console.log("File deleted successfully");
        console.log(data);
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
