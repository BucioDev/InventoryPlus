import prisma from "@/app/lib/prisma";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MoreHorizontal, PlusCircle } from "lucide-react";
import Link from "next/link";


async function getSucursales(){
    const data = await prisma.sucursales.findMany({
        where:{
            isDeleted:false,
        }
    })

    return data;
}

export default async function SucursalesPage() {

    const sucursales = await getSucursales();
    return(
        <>
        <div className="flex items-center justify-end mt-5">
            <Button asChild className="flex items-center gap-x-2">
                <Link href="/sucursales/create">
                    <PlusCircle className="h-5 w-5" />
                    <span>Crear nueva Sucursal</span>
                </Link>
            </Button>
        </div>
        <Card className="mt-5">
            <CardHeader>
                <CardTitle>Sucursales</CardTitle>
                <CardDescription>Lista de sucursales y sus datos</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Nombre de la sucursal</TableHead>
                            <TableHead>Descripcion</TableHead>
                            <TableHead>Uso de la sucursal</TableHead>
                            <TableHead className="text-right">Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {sucursales.map((sucur)=>(
                            <TableRow key={sucur.id}>
                                <TableCell>{sucur.name}</TableCell>
                                <TableCell>{sucur.description}</TableCell>
                                <TableCell>{sucur.use}</TableCell>
                                <TableCell className="text-right">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button size="icon">
                                                <MoreHorizontal className="h-5 w-5" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuLabel>
                                                Acciones
                                            </DropdownMenuLabel>
                                            <DropdownMenuSeparator/>
                                            <DropdownMenuItem asChild><Link href={`/sucursales/${sucur.id}`}>Editar</Link></DropdownMenuItem>
                                            <DropdownMenuItem asChild><Link href={`/sucursales/${sucur.id}/delete`}>Eliminar</Link></DropdownMenuItem>
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