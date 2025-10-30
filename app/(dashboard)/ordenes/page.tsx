import prisma from "@/app/lib/prisma";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MoreHorizontal, PlusCircle } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";


async function GetOrders(){
    const data = await prisma.order.findMany({
        select:{
            id:true,
            nickname: true,
            total: true,
            status: true,
            sellDate: true,
            items:{
                select:{
                    quantity:true
                }
            }
        },
        orderBy:{
            createdAt: "desc"
        }
    });
    

     const result = data.map(order => {
        const totalQuantity = order.items.reduce((sum, item) => sum + item.quantity, 0);
        return {
            ...order,
            totalQuantity
        };
    });

    return result;
}

export default async function OrdenesPage(){
    const orders = await GetOrders()
    return(
        <>
        <div className="flex items-center justify-end mt-5">
         <Button asChild>
            <Link href="/ordenes/create">
            <PlusCircle />
            Agregar nueva orden
            
            </Link>
         </Button>
        </div>
        <Card className="mt-5">
            <CardHeader>
                <CardTitle> Ordenes </CardTitle>
                <CardDescription>Usar opcion ver orden, para agregar productos</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead> Apodo/nombre del cliente </TableHead>
                            <TableHead> Cantidad de productos </TableHead>
                            <TableHead> Total a pagar </TableHead>
                            <TableHead> Estado de orden </TableHead>
                            <TableHead> Fecha de venta  </TableHead>
                            <TableHead className="text-right"> Acciones </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {orders.map((order) => {
                        const rowClass =
                        order.status === "completada"
                            ? "bg-green-200 font-medium"
                            : order.status === "cancelado"
                            ? "bg-red-200 font-medium"
                            : "";

                        return (
                        <TableRow key={order.id} className={rowClass}>
                            <TableCell>{order.nickname}</TableCell>
                            <TableCell>{order.totalQuantity}</TableCell>
                            <TableCell>{order.total}</TableCell>
                            <TableCell>{order.status}</TableCell>
                            <TableCell>{order.sellDate
                                ? new Intl.DateTimeFormat('es-MX', {
                                    day: '2-digit',
                                    month: '2-digit',
                                    year: 'numeric',
                                }).format(new Date(order.sellDate))
                                : '—'}
                            </TableCell>
                            <TableCell className="text-right">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button>
                                            <MoreHorizontal/>
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                        <DropdownMenuLabel>
                                            Acciones
                                        </DropdownMenuLabel>
                                        <DropdownMenuSeparator/>
                                       {order.status === "completada" ? (
                                            <DropdownMenuItem>
                                                <Link href={`/ordenes/${order.id}/refund`}>Reembolsar</Link>
                                            </DropdownMenuItem>
                                            ) : (
                                            <DropdownMenuItem>
                                                <Link href={`/ordenes/${order.id}`}>Editar</Link>
                                            </DropdownMenuItem>
                                            )}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                        );
                    })}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
        </>
    )
}