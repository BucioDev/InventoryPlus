import { getSesion } from "@/app/actions";
import prisma from "@/app/lib/prisma";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MoreHorizontal, PlusCircle } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

async function getClientes(){

    const clientes = await prisma.clientes.findMany({
        where:{
            isDeleted: false,
        },
        orderBy:{
            createdAt:"desc",
        }
    });

    return clientes;
}  

export default async function clientesPage(){
    
    const clientes = await getClientes();
    const session = await getSesion();
    
    if (session.role == "vendor"){
        redirect("/ordenes");
    }

    return (
        <>
        <div className="flex items-center justify-end mt-5">
            <Button asChild className="flex items-center gap-x-2">
                <Link href="/clientes/create">
                    <PlusCircle className="h-5 w-5" />
                    <span>Agregar nuevo cliente</span>
                </Link>
            </Button>
        </div>
        <Card className="mt-5">
            <CardHeader>
                <CardTitle>Clientes</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                        <TableHead>Nombre / Empresa</TableHead>
                        <TableHead>Telefono</TableHead>
                        <TableHead>Descuento</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {clientes.map((cliente)=>(
                            <TableRow key={cliente.id}>
                                <TableCell>{cliente.nombre}</TableCell>
                                <TableCell>{cliente.codigo}</TableCell>
                                <TableCell>{cliente.descuento}</TableCell>
                                <TableCell className="text-right">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="default" size="icon">
                                                <MoreHorizontal className="h-5 w-5" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuLabel>
                                                Acciones
                                            </DropdownMenuLabel>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem asChild><Link href={`/clientes/${cliente.id}`}>Editar Datos</Link></DropdownMenuItem>
                                            <DropdownMenuItem asChild><Link href={`/clientes/${cliente.id}/delete`}>Eliminar Usuario</Link></DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
        </>
    )
}