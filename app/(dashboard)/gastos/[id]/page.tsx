import EditGastosForm from "@/app/components/dashboard/forms/editGastosForm";
import prisma from "@/app/lib/prisma";
import { notFound } from "next/navigation";

async function getGasto(id:string) {
    const data = await prisma.gastos.findUnique({
        where:{
            id:id
        },
        select:{
            id:true,
            name:true,
            amount:true,
        }
    });
    
    if (!data){
        return notFound();
    }

    return data;
}

export default async function editGastosPage({params}:{params:Promise<{id:string}>}){
    const {id} = await params; 
    const gasto = await getGasto(id)

    return(
        <div>
            <EditGastosForm data={gasto}/>
        </div>
    )
}