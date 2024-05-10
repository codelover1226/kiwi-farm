'use client'

import { ManageProducts } from "@/components/products/ManageProducts"
import { NewProductForm } from "@/components/products/NewProductForm"
export default function Home(){
    return(
        <div className="">
            <h2 className="text-2xl py-3 self-center text-center">Manage Items</h2>
            <div className="">
                <ManageProducts/>
                <NewProductForm/>
            </div>
        </div>
    )
}