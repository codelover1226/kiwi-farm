'use server'
import {NextResponse} from 'next/server';
import supabase from '@/supabase/supabaseClient';
import fs from 'fs';
import path from 'path';

const saveFile = async (formData, key) => {
    const file = formData.get(key) as File;
    if(file instanceof File) {
        const fileData = Buffer.from(await file?.arrayBuffer());
        //   const publicFolderPath = path.join(process.cwd(), 'public/uploads/products/');
        const fileName = `${Date.now()}${file.name.substring(file.name.lastIndexOf('.'))}`; // Change the filename if needed
        //   fs.mkdirSync(publicFolderPath, {recursive: true});
        //   const filePath = path.join(publicFolderPath, fileName);
        //   await fs.promises.writeFile(filePath, fileData);
        const {data, error} = await supabase.storage.from('products').upload(fileName, fileData)
        if (error) {
            console.error(error);
        }
        //   console.log(data);
        const res = supabase.storage.from('products').getPublicUrl(fileName)
        return res.data.publicUrl;
        // return fileName;
    }
    return "";
}
export async function POST(request : Request, params : {
    action: string
}) {
    const formData = await request.formData();
    const imgUrl = await saveFile(formData, "imgFile");
    
    const user_id = formData.get("user_id");
    const price = formData.get("price");
    const title = formData.get("title");
    const slug = formData.get("slug");
    const description = formData.get("description");
    const content = formData.get("content");
    const quantity = formData.get("quantity");
    const type = formData.get("type");
    const id = formData.get("id");
    const image = formData.get("image") as string;
    const flavorString = formData.get("flavor");
    const flavor = flavorString? JSON.parse(flavorString as string) : null;
    const couponString = formData.get("coupon");
    const coupon = couponString? JSON.parse(couponString as string) : null
    console.log("image : " + image)
    //delete file when removing item img or updating
    if(imgUrl != ""){
        // require('fs').unlink(process.cwd() + "/public" + image, (err) => {
        //     if (err) {
        //         console.error('Error deleting file:', err);
        //     }
        //     console.log('File deleted successfully');
        // });
        console.log("fileName : " + image.split('/').pop());
        const {data, error} = await supabase.storage.from('products').remove([image.split('/').pop()]);
        if(error){
            console.error("can't delete file.\n" + error)
        }else{
            console.log("File deleted successfully\n" + data);
            console.log(data);
        }
    }
    try {
        const {error} = await supabase
            .from('products')
            .update({
                title,
                slug,
                description,
                content,
                price,
                quantity,
                type,
                user_id,
                image : imgUrl==""?image:imgUrl,
                flavor,
                coupon
            })
            .eq("id", id)

        if (error) {
            console.error(error)
            return NextResponse.json(error.details, {status: 401});
        }
        return NextResponse.json("success", {status: 200});
    } catch (error) {
        console.error('Error fetching users:', error);
        return NextResponse.json('NO Auth', {status: 401});
    }
}
