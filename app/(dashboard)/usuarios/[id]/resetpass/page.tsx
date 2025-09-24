import { changePassword } from "@/app/actions";
import { SubmitButton } from "@/app/components/SubmitButtons";
import prisma from "@/app/lib/prisma";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import Link from "next/link";
import { notFound } from "next/navigation";


async function getFullName(id:string){
    const data = await prisma.user.findUnique({
        where:{
            id:id,
        },
        select:{
            username:true,
            firstName:true,
            lastName:true ,
        }
    });

    if(!data){
        return notFound();
    }

    return data;
}


export default async function userResetPassPage({params}:{params:Promise<{id:string}>}){
    const {id} = await params;
    const user = await getFullName(id);
    return(
        <div className="h-[80vh] w-full flex items-center justify-center">
            <Card className="w-full max-w-xl">
                <CardHeader>
                    <CardTitle>Cambio de contraseña para {user.username}</CardTitle>
                    <CardDescription>Esto Cambiara la contraseña del usuario {user.username} que pertenece a {user.firstName} {user.lastName}</CardDescription>
                </CardHeader>
                <CardContent>
                    <form action={changePassword}>
                        <div className="flex flex-col gap-6">
                        <div className="flex flex-col gap-3">
                        <input type="hidden" name="id" value={id} />
                        <input type="hidden" name="username" value={user.username} />
                        <Label>Escriba la nueva contraseña</Label>
                        <Input type="password" name="pass" placeholder="Contraseña" className="w-full" />
                        </div>
                        <div className="flex justify-between ">
                            <Button variant="default"  asChild>
                                <Link href="/usuarios">Cancelar</Link>
                            </Button>
                            <SubmitButton text="Cambiar Contraseña" />
                        </div>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )

}