import {  DeleteUser, Deleteclient } from "@/app/actions";
import { DeleteButton } from "@/app/components/SubmitButtons";
import prisma from "@/app/lib/prisma";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { notFound } from "next/navigation";

async function getName(id:string){
    const data = await prisma.clientes.findUnique({
        where:{
            id:id,
        },
        select:{
            nombre:true,
        }
    });

    if(!data){
        return notFound();
    }

    return data.nombre;
}

export default async function clienteDeletePage({params}:{params:Promise<{id:string}>}){
    const {id} = await params;
    const username = await getName(id);
    return(

        <div className="h-[80vh] w-full flex items-center justify-center">
            <Card className="w-full max-w-xl">
                <CardHeader>
                    <CardTitle>Esta seguro que desea eliminar al cliente {username}?</CardTitle>
                    <CardDescription>Esta accion no se puede deshacer</CardDescription>
                </CardHeader>
                <CardContent className="w-full flex justify-between">
                    <Button asChild><Link href={`/clientes`}>Cancelar</Link></Button>
                    <form action={Deleteclient}>
                        <input type="hidden" name="id" value={id} />
                        <input type="hidden" name="username" value={username} />
                        <DeleteButton text="Eliminar Usuario" />
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}