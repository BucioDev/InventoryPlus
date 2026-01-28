import {  DeleteGasto, DeleteProveedor } from "@/app/actions";
import { DeleteButton } from "@/app/components/SubmitButtons";
import prisma from "@/app/lib/prisma";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { notFound } from "next/navigation";



export default async function userDeletePage({params}:{params:Promise<{id:string}>}){
    const {id} = await params;
    return(

        <div className="h-[80vh] w-full flex items-center justify-center">
            <Card className="w-full max-w-xl">
                <CardHeader>
                    <CardTitle>Esta seguro que desea eliminar este Gasto?</CardTitle>
                    <CardDescription>Esta accion no se puede deshacer</CardDescription>
                </CardHeader>
                <CardContent className="w-full flex justify-between">
                    <Button asChild><Link href={`/gastos`}>Cancelar</Link></Button>
                    <form action={DeleteGasto}>
                        <input type="hidden" name="id" value={id} />
                        <DeleteButton text="Eliminar gasto" />
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}