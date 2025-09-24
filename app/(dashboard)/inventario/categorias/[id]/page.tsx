
import EditCategoryForm from "@/app/components/dashboard/editCategoryForm";
import prisma from "@/app/lib/prisma";
import { notFound } from "next/navigation";

async function getCategory(id:string){
    const data = await prisma.category.findUnique({
        where:{
            id:id,
        }
    });

    if(!data){
        return notFound();
    }
    return data;
}


export default async function EditCategory({params}:{params:Promise<{id:string}>}) {
    const { id } = await params;
    const category = await getCategory(id);
    return(
        <div>
            <EditCategoryForm data={category} />
        </div>
    )
}