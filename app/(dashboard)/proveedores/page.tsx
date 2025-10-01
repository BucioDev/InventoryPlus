import prisma from "@/app/lib/prisma";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MoreHorizontal, PlusCircle } from "lucide-react";
import Link from "next/link";

async function getProveedores(){
    const data = await prisma.proveedores.findMany({
        where:{
            isDeleted:false
        },
        orderBy:{
            createdAt:"desc"
        }
    })

    return data
}

export default async function proveedoresPage() {
    const proveedores = await getProveedores();
    return(
        <>
        <div className="mt-5 flex items-center justify-end">
            <Button asChild>
                <Link href="/proveedores/create">
                <PlusCircle/>
                Crear proveedor
                </Link>
            </Button>
        </div>
        <Card className="mt-5">
            <CardHeader>
                <CardTitle>
                    Proveedores
                </CardTitle>
                <CardDescription>proveedores y sus datos de contacto</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Nombre de compañia</TableHead>
                            <TableHead>Telefono</TableHead>
                            <TableHead>Correo</TableHead>
                            <TableHead>Nombre de Contacto directo</TableHead>
                            <TableHead>Telefono de Contacto</TableHead>
                            <TableHead>Correo de Contacto</TableHead>
                            <TableHead className="text-right">Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {proveedores.map((proveedor)=>(
                            <TableRow key={proveedor.id}>
                                <TableCell>{proveedor.companyName}</TableCell>
                                <TableCell>{proveedor.companyPhone}</TableCell>
                                <TableCell>{proveedor.companyEmail}</TableCell>
                                <TableCell>{proveedor.contactName}</TableCell>
                                <TableCell>{proveedor.contactPhone}</TableCell>
                                <TableCell>{proveedor.contactEmail}</TableCell>
                                <TableCell className="text-right">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button>
                                                <MoreHorizontal/>
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                                            <DropdownMenuSeparator/>
                                            <DropdownMenuItem asChild><Link href={`/proveedores/${proveedor.id}`}>Editar</Link></DropdownMenuItem>
                                            <DropdownMenuItem asChild><Link href={`/proveedores/${proveedor.id}/delete`}>Eliminar</Link></DropdownMenuItem>
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