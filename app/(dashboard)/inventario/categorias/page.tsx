"use client"
import prisma from "@/app/lib/prisma";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ChevronLeft, MoreHorizontal, PlusCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

 
type Category = {
    id: string;
    name: string;
    description: string;
    };

export default function InventarioPage() {

    const [categories, setCategories] = useState<Category[]>([]);

    useEffect(() => {
      

        const fetchCategories = async () => {
            const res = await fetch("/api/categorias");
            const data: Category[] = await res.json();
            setCategories(data);
        }
        fetchCategories();
    }, []);


    return ( 
<div className="grid gap-5 mt-5">
        <Card>
        <CardHeader>
                <CardTitle>Acciones</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-between">
                <Button asChild><Link href="/inventario"><ChevronLeft/></Link></Button>
                <Button asChild><Link href="/inventario/categorias/create"><PlusCircle/> Agregar categoria </Link></Button>
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>Categorias</CardTitle>
                <CardDescription>Categorias de productos</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Nombre</TableHead>
                            <TableHead>Descripcion</TableHead>
                            <TableHead className="text-right">Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {categories.map((cat)=>(
                            <TableRow key={cat.id}>
                                <TableCell>{cat.name}</TableCell>
                                <TableCell>{cat.description}</TableCell>
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
                                            <DropdownMenuItem asChild><Link href={`/inventario/categorias/${cat.id}`}>Editar</Link></DropdownMenuItem>
                                            <DropdownMenuItem asChild><Link href={`/inventario/categorias/${cat.id}/delete`}>Eliminar</Link></DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>

</div>

    )
}