import EditProductForm from "@/app/components/dashboard/EditProductForm";
import prisma from "@/app/lib/prisma";
import { notFound } from "next/navigation";

async function getProduct(id:string){
    const data = await prisma.product.findUnique({
        where:{
            id:id,
        },
    })

    if(!data){
        return notFound();
    }
    return data;
}



export default async function EditProductPage({params}:{params:Promise<{id:string}>}) {
    const { id } = await params;
    const product = await getProduct(id);
   
    
    return(
        <div>
            <EditProductForm data={product} />
        </div>
    )
}