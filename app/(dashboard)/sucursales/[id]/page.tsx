import EditSucursalForm from "@/app/components/dashboard/editSucursalForm";
import prisma from "@/app/lib/prisma"
import { notFound } from "next/navigation"




async function getSucursal(id:string){
    const data = await prisma.sucursales.findUnique({
        where:{
            id:id,
            isDeleted:false,
        }
    })

    if(!data){
        return notFound();
    }
    return data;
}



export default async function SucursalEditPage({params}:{params:Promise<{id:string}>}){
    const { id } = await params;
    const sucursal = await getSucursal(id);
    return(
        <div>
            <EditSucursalForm data={sucursal} />
        </div>
    )
}