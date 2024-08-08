'use server'
import {NextResponse} from 'next/server';
import supabase from '@/supabase/supabaseClient';

const saveFile = async (formData, key) => {
    const file = formData.get(key) as File;
    if(file instanceof File) {
        const fileData = Buffer.from(await file?.arrayBuffer());
        const fileName = `${Date.now()}${file.name.substring(file.name.lastIndexOf('.'))}`; 
        const {data, error} = await supabase.storage.from('products').upload(fileName, fileData)
        if (error) {
            console.error(error);
        }
        const res = supabase.storage.from('products').getPublicUrl(fileName)
        return res.data.publicUrl;
    }
    return "";
}

export async function POST(request : Request, params : {
    action: string
}) {
    const formData = await request.formData();
    const imgUrl = await saveFile(formData, "imgFile");
    const user_id = formData.get("user_id");
    const title = formData.get("title");
    const slug = formData.get("slug");
    const description = formData.get("description");
    const tagline = formData.get("tagline");
    const content = formData.get("content");
    const type = formData.get("type");
    const id = formData.get("id");
    const image = formData.get("image") as string;
    const flavorString = formData.get("flavor");
    const flavor = flavorString? JSON.parse(flavorString as string) : null;

    if(imgUrl != ""){
        const {data, error} = await supabase.storage.from('products').remove([image.split('/').pop()]);
        if(error){
            console.error("can't delete file.\n" + error)
        }else{
        }
    }
    try {
        const {error} = await supabase
            .from('products')
            .update({
                title,
                slug,
                tagline,
                description,
                content,
                type,
                user_id,
                image : imgUrl==""?image:imgUrl,
                flavor
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
