import EditUserForm from "@/app/components/dashboard/editUserForm";
import prisma from "@/app/lib/prisma";
import { notFound } from "next/navigation";



async function getUser(id: string){
    const data = await prisma.user.findUnique({
        where:{
            id:id,
        },
    });

    if(!data){
        return notFound();
    }

    return data;
}


export default async function userEditPage({params}:{params:Promise<{id:string}>}){

    const {id} = await params;
    const user = await getUser(id);
    return(
        <div>
            <EditUserForm data={user} />
        </div>
    )
}
