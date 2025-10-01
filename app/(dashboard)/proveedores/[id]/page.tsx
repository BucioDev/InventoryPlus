import EditProveedorForm from "@/app/components/dashboard/editProveedorForm";
import prisma from "@/app/lib/prisma";
import { notFound } from "next/navigation";



async function GetProveedor(id:string){
    const data = await prisma.proveedores.findUnique({
        where:{
            id:id
        }
    })

    if(!data){
        return notFound();
    }

    return data
}

export default async function editProveedorPage({params}:{params:Promise<{id:string}>}){
    const {id} = await params;
    const proveedor = await GetProveedor(id);

    return(
        <div>
            <EditProveedorForm data={proveedor}/>
        </div>
    )

}