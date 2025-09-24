import { ToastHandler } from "@/app/components/ToastHandler";
import prisma from "@/app/lib/prisma";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MoreHorizontal } from "lucide-react";
import Link from "next/link";

async function getCategories(){
    const data = await prisma.category.findMany({
        select:{
            id:true,
            name:true,
            description:true,
            Product:{
                select:{
                    stock:true,
                }
            }
        },
        where:{
            isDeleted:false,
            }
    });

    return data;
}

async function getProduts(){
    const data = await prisma.product.findMany({
        select:{
            id:true,
            name:true,
            barcode:true,
            categoryId:true,
            compatibility:true,
            brand:true,
            location:true,
            variant:true,
            stock:true,
            sellprice:true,
            buyprice:true,
            category:{
                select:{
                    name:true,
                }
            }
        },
        where:{
            isDeleted:false,
        }
    })
    return data;
}

export default async function InventarioPage() {
    const categories = await getCategories();
    const products = await getProduts();

    return ( 
<div className="grid grid-cols-3 grid-rows-4 gap-4 mt-5">
    <div className="col-span-3 col-start-1">
        <Card>
        <CardHeader>
                <CardTitle>Acciones</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-between">
                <Button asChild><Link href="/inventario/productos/create">Agregar producto</Link></Button>
                <Button asChild><Link href="/inventario/categorias/create">Agregar categoria</Link></Button>
            </CardContent>
        </Card>
    </div>
    <div className="col-span-2 row-span-3 col-start-1 row-start-2">
        <Card>
            <CardHeader>
                <CardTitle>Productos</CardTitle>
                <CardDescription>Productos en inventario</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Nombre</TableHead>
                            <TableHead>Codigo de barras</TableHead>
                            <TableHead>Categoria</TableHead>
                            <TableHead>Compatibilidad</TableHead>
                            <TableHead>Marca</TableHead>
                            <TableHead>Ubicacion</TableHead>
                            <TableHead>Variante</TableHead>
                            <TableHead>Stock</TableHead>
                            <TableHead>Precio de compra</TableHead>
                            <TableHead>Precio de venta</TableHead>
                            <TableHead>Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {products.map((product) => (
                            <TableRow key={product.id}>
                                <TableCell>{product.name}</TableCell>
                                <TableCell>{product.barcode}</TableCell>
                                <TableCell>{product.category.name}</TableCell>
                                <TableCell>{product.compatibility.join(', ')}</TableCell>
                                <TableCell>{product.brand}</TableCell>
                                <TableCell>{product.location}</TableCell>
                                <TableCell>{product.variant}</TableCell>
                                <TableCell>{product.stock}</TableCell>
                                <TableCell>{product.buyprice}</TableCell>
                                <TableCell>{product.sellprice}</TableCell>
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
                                            <DropdownMenuItem asChild><Link href={`/inventario/productos/${product.id}`}>Editar</Link></DropdownMenuItem>
                                            <DropdownMenuItem asChild><Link href={`/inventario/productos/${product.id}/delete`}>Eliminar</Link></DropdownMenuItem>
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
    <div className="row-span-3 col-start-3 row-start-2">
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
                            <TableHead>Stock</TableHead>
                            <TableHead className="text-right">Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {categories.map((cat)=>(
                            <TableRow key={cat.id}>
                                <TableCell>{cat.name}</TableCell>
                                <TableCell>{cat.description}</TableCell>
                                <TableCell>{cat.Product.reduce((sum, item) => sum + item.stock, 0)}</TableCell>
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
</div>

    )
}