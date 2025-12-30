import {  DeleteUser, RefundOrder } from "@/app/actions";
import { DeleteButton } from "@/app/components/SubmitButtons";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";


export default async function refundOrderPage({params}:{params:Promise<{id:string}>}){
    const {id} = await params;
    return(

        <div className="h-[80vh] w-full flex items-center justify-center">
            <Card className="w-full max-w-xl">
                <CardHeader>
                    <CardTitle>Esta seguro que desea Reembolsar la oder?</CardTitle>
                    <CardDescription>Esta accion no se puede deshacer, debera crear una nueva orden</CardDescription>
                </CardHeader>
                <CardContent className="w-full flex justify-between">
                    <Button asChild><Link href={`/ordenes`}>Cancelar</Link></Button>
                    <form action={RefundOrder}>
                        <input type="hidden" name="id" value={id} />
                        <DeleteButton text="Reembolsar Orden" />
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}