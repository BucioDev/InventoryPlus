
import { getSesion, isLoggedIn } from "@/app/actions";
import prisma from "@/app/lib/prisma";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { get } from "http";
import {  MoreHorizontal, PlusCircle } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

async function getUsers(){
    const data = await prisma.user.findMany({
        where:{
            isDeleted:false
        },
        orderBy:{
            createdAt:"desc",
        }
    });

    return data;
}



export default async function UsersPage() {

    const data = await getUsers();
    const session = await getSesion();

    return (
        <>
        {session.role === "admin" ? (
           <>
           <div className="flex items-center justify-end mt-5">
            <Button asChild className="flex items-center gap-x-2">
                <Link href="/usuarios/create">
                    <PlusCircle className="h-5 w-5" />
                    <span>Crear nuevo Usuario</span>
                </Link>
            </Button>
        </div>
        <Card className="mt-5">
            <CardHeader>
                <CardTitle>Usuarios</CardTitle>
                <CardDescription>Lista de usuarios</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Nombre de usuario</TableHead>
                            <TableHead>Nombre</TableHead>
                            <TableHead>Rol</TableHead>
                            <TableHead>Fue Creado</TableHead>
                            <TableHead className="text-right">Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.map((user)=>(
                            <TableRow key={user.id}>
                                <TableCell>{user.username}</TableCell>
                                <TableCell>{user.firstName} {user.lastName}</TableCell>
                                <TableCell>{user.role}</TableCell>
                                <TableCell>{new Intl.DateTimeFormat(['ban','id']).format(user.createdAt)}</TableCell>
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
                                            <DropdownMenuItem asChild><Link href={`/usuarios/${user.id}`}>Editar Datos</Link></DropdownMenuItem>
                                            <DropdownMenuItem asChild><Link href={`/usuarios/${user.id}/resetpass`}>Cambiar Contraseña</Link></DropdownMenuItem>
                                            <DropdownMenuItem asChild><Link href={`/usuarios/${user.id}/delete`}>Eliminar Usuario</Link></DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))
                        }
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
           </>
        ):(
            <div className="flex items-center justify-center mt-5">
            <p className="text-xl text-red-500">No tiene permisos para ver los usuarios</p>
            </div>
        )
        }
        </>
    )
 }
