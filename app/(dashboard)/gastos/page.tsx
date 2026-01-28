import { isLoggedIn } from "@/app/actions";
import prisma from "@/app/lib/prisma";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MoreHorizontal, PlusCircle } from "lucide-react";
import Link from "next/link";


async function getGastos(){
    const data = await prisma.gastos.findMany({
        where:{
            isDeleted:false,
        },
        orderBy:{
            createdAt:"desc"
        },
    });

    return data;
}

export default async function gastosPage(){
    const data = await getGastos();
    const session = await isLoggedIn();
    return(
        <>
        {session.role === "admin" ? (
            <>
            <div className="flex justify-end items-center mt-5">
                <Button asChild>
                        <Link href="/gastos/create">
                        <PlusCircle/>
                        Agregar Gastos
                        </Link>
                </Button>
            </div>
            <Card className="mt-5">
                <CardHeader>
                    <CardTitle>Gastos de la empresa</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nombre / Razon del gasto</TableHead>
                                <TableHead> Cantidad del Gasto </TableHead>
                                <TableHead>Fecha</TableHead>
                                <TableHead className="text-right">Acciones</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data.map((gasto)=>(
                                <TableRow key={gasto.id}>
                                    <TableCell>{gasto.name}</TableCell>
                                    <TableCell>{gasto.amount}</TableCell>
                                    <TableCell>{new Intl.DateTimeFormat(['ban','id']).format(gasto.createdAt)}</TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="default" size="icon">
                                                    <MoreHorizontal className="size-5"/>
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent>
                                                <DropdownMenuLabel>
                                                    Acciones
                                                </DropdownMenuLabel>
                                                <DropdownMenuSeparator/>
                                                <DropdownMenuItem><Link href={`/gastos/${gasto.id}`}>Editar</Link></DropdownMenuItem>
                                                <DropdownMenuItem><Link href={`/gastos/${gasto.id}/delete`}>Eliminar</Link></DropdownMenuItem>
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
            ):(
            <div className="flex items-center justify-center mt-5">
            <p className="text-xl text-red-500">No tiene permisos para ver los Gastos</p>
            </div>
        )
        }
        </>
    )
}