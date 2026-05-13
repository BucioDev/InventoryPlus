import EditClienteForm from "@/app/components/dashboard/forms/editClienteForm";
import prisma from "@/app/lib/prisma"
import { da } from "date-fns/locale";
import { notFound } from "next/navigation";



async function getCliente(id:string){
    const data = await prisma.clientes.findFirst({
        where:{
            id:id,
            isDeleted:false
        },
        
    });


    if(!data){
        return notFound();
    }
    
    return data;
}

export default async function editClientspage({params}:{params:Promise<{id:string}>}){
    const {id} = await params;
    const data = await getCliente(id);

    return (
        <div>
            <EditClienteForm data={data}/>
        </div>
    )
}
