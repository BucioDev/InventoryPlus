
import { isLoggedIn } from "@/app/actions";
import PrintReceiptButton from "@/app/components/PrintReceiptButton";
import prisma from "@/app/lib/prisma";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MoreHorizontal, PlusCircle } from "lucide-react";
import OrderSearch from "@/app/components/OrderSearch";
import Link from "next/link";

export const dynamic = "force-dynamic";


async function GetOrders(search?: string) {
    const data = await prisma.order.findMany({
      where: search? {
            OR: [{
                nickname: {
                    contains: search,
                    mode:"insensitive",
                },
            },
            {
                id: {
                    contains: search,
                    mode:"insensitive",
                },
            },
            ],
          }: undefined,
      select: {
        id: true,
        nickname: true,
        total: true,
        realTotal: true,
        status: true,
        paymentmethod: true,
        location: true,
        debt: true,
        pay_debt: true,
        last_payment: true,
        change: true,
        descuento: true,
        cliente: {
          select: {
            nombre: true,
            codigo: true,
          },
        },
        userID: true,
        sellDate: true,
        user: {
          select: {
            firstName: true,
          },
        },
        items: {
          select: {
            quantity: true,
            priceAtSale: true,
            product: {
              select: {
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return data.map((order) => {
      const totalQuantity = order.items.reduce(
        (sum, item) => sum + item.quantity,
        0
      );
  
      return {
        ...order,
        totalQuantity,
      };
    });
  }
  
  export default async function OrdenesPage({searchParams,}: {searchParams: Promise<{search?: string;}>;}) {
    const params = await searchParams;
    const search = params.search || "";
    const orders = await GetOrders(search);
    const session = await isLoggedIn();

    return (
      <>
        <div className="flex items-center justify-between mt-5 gap-4">
          <Button asChild>
            <Link href="/ordenes/create">
              <PlusCircle />
              Agregar nueva orden
            </Link>
          </Button>
        </div>
  
        <Card className="mt-5">
          <CardHeader>
            <CardTitle>Ordenes</CardTitle>
            <CardDescription>
              Usar opcion ver orden, para agregar productos
            </CardDescription>
            <div className="mt-4">
            <OrderSearch />
            </div>
          </CardHeader>
          <CardContent>
            <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Apodo/nombre del cliente</TableHead>
                    <TableHead>Cantidad de productos</TableHead>
                    <TableHead>Total a pagar</TableHead>
                    <TableHead>Estado de orden</TableHead>
                    <TableHead>Metodo de pago</TableHead>
                    <TableHead>Fecha de venta</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => {
                  const rowClass = order.status === "completada" ? "bg-green-200 font-medium"
                        : order.status === "cancelado" ? "bg-red-200 font-medium" : "";
                  return (
                    <TableRow
                      key={order.id}
                      className={rowClass}
                    >
                      <TableCell>{order.nickname}</TableCell>
                      <TableCell>{order.totalQuantity}</TableCell>
                      <TableCell>{order.realTotal ?? order.total}</TableCell>
                      <TableCell>{order.status}</TableCell>
                      <TableCell>{order.paymentmethod}</TableCell>
                      <TableCell>
                        {order.sellDate
                          ? new Intl.DateTimeFormat(
                              "es-MX",
                              {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                              }
                            ).format(
                              new Date(order.sellDate)
                            )
                          : "—"}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button>
                              <MoreHorizontal />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuLabel>
                              Acciones
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            {order.status ===
                            "completada" ? (
                              <DropdownMenuItem>
                                <Link
                                  href={`/ordenes/${order.id}/refund`}
                                >
                                  Reembolsar
                                </Link>
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem>
                                <Link
                                  href={`/ordenes/${order.id}`}>
                                  Editar
                                </Link>
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem>
                              <PrintReceiptButton
                                order={order}
                                username={
                                  session.firstName as string
                                }
                              />
                            </DropdownMenuItem>
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
    );
  }