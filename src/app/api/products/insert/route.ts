import {NextResponse, NextRequest} from 'next/server';
import supabase from '@/supabase/supabaseClient';
import fs from 'fs';
import path from 'path';

const saveFile = async (formData, key) => {
  const file = formData.get(key) as File;
  if(file instanceof File){
      const fileData = Buffer.from(await file?.arrayBuffer());
    //   const publicFolderPath = path.join(process.cwd(), 'public/uploads/products/');
      const fileName = `${Date.now()}${file.name.substring(file.name.lastIndexOf('.'))}`; // Change the filename if needed
    //   fs.mkdirSync(publicFolderPath, {recursive: true});
    //   const filePath = path.join(publicFolderPath, fileName);
    //   await fs.promises.writeFile(filePath, fileData);
      await supabase.storage.from('products').upload(fileName, fileData)
      const { data } = supabase.storage.from('products').getPublicUrl(fileName)
      return data.publicUrl;
  }
  return "";
}

export async function POST(req : Request) {
  
    try {
        const formData = await req.formData();
        const imgUrl = await saveFile(formData, "imgFile");
        const user_id = formData.get("user_id");
        const price = formData.get("price");
        const title = formData.get("title");
        const slug = formData.get("slug");
        const description = formData.get("description");
        const content = formData.get("content");
        const quantity = formData.get("quantity");
        const type = formData.get("type"); 
        const flavorString = formData.get("flavor");
        const flavor = flavorString? JSON.parse(flavorString as string) : null;
        try {
          const {error} = await supabase
            .from('products')
            .insert({
              title,
              slug,
              description,
              content,
              price,
              quantity,
              type,
              user_id,
              image: imgUrl,
              flavor
            });

          if (error) {
            console.error('Supabase error:', error);
            return NextResponse.json(error.details, {status: 401});
          }
          return NextResponse.json('success', {status: 200});
        } catch (error) {
            console.error('Error inserting product:', error);
            return NextResponse.json('Error inserting product:', {status: 500});
        }
    } catch (error) {
        console.error('Error handling request:', error);
        return NextResponse.json('Error handling request:', {status: 500});
    }
}
