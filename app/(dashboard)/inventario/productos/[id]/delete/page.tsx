
import {  DeleteProduct } from "@/app/actions";
import { DeleteButton } from "@/app/components/SubmitButtons";
import prisma from "@/app/lib/prisma";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { notFound } from "next/navigation";

async function getName(id:string){
    const data = await prisma.product.findUnique({
        select:{
            name:true,
        },
        where:{
            id:id,
        }
    })
    if(!data){
        return notFound();
    }
    return data.name;
}

export default async function DeleteProductPage({ params}: {params: Promise<{id:string}>}){
    const { id } = await params;
    const name = await getName(id);
    return(
        <div className="h-[80vh] w-full flex items-center justify-center">
            <Card className="w-full max-w-xl">
                <CardHeader>
                <CardTitle>Esta seguro que desea eliminar este producto?</CardTitle>
                    <CardDescription>Esta accion no se puede deshacer</CardDescription>
                </CardHeader>
                <CardFooter className="w-full flex justify-between">
                    <Button variant="secondary" asChild><Link href="/inventario">Cancel</Link></Button>
                    <form action={DeleteProduct}>
                        <input type="hidden" name="id" value={id} />
                        <input type="hidden" name="name" value={name} />
                    <DeleteButton text="Eliminar Producto" />
                    </form>
                </CardFooter>
            </Card>
        </div>
    )
}