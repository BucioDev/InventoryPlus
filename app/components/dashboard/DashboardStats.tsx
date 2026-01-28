import prisma from "@/app/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Car, DollarSign, Package2Icon, ShoppingCartIcon } from "lucide-react";


async function getStats(){
    const startOfMonth = new Date();
startOfMonth.setDate(1);
startOfMonth.setHours(0, 0, 0, 0);

const endOfMonth = new Date();
endOfMonth.setMonth(endOfMonth.getMonth() + 1);
endOfMonth.setDate(0);
endOfMonth.setHours(23, 59, 59, 999);

    const [sales,bills,productCount] = await Promise.all([
        prisma.order.findMany({
            where:{
                status:"completada",
                sellDate: {
                    gte: startOfMonth,
                    lte: endOfMonth,
                  },
            },
            select:{
                total:true,
                orderPrice:true
            }
        }),

        prisma.gastos.findMany({
            where:{
                isDeleted:false,
                createdAt:{
                    gte: startOfMonth,
                    lte: endOfMonth,
                },
            },
            select:{
                amount:true
            }
        }),

        prisma.product.findMany({
            where:{
                isDeleted:false
            },
            select:{
                id:true
            },
        }),
    ]);

    return{
        sales,
        bills,
        productCount
    }
}



export async function DashboardStats() {
    const {sales, bills, productCount} = await getStats();
    const totalBills = bills.reduce((total, bill)=>{return total + bill.amount},0);
    const totalRevenue = sales.reduce((total, sale) => {return total + (sale.total - sale.orderPrice)}, 0) - totalBills;
    return(
        <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4 mt-5">
            <Card >
                <CardHeader className="flex flex-row items-center justify-between pb-2"> 
                    <CardTitle>
                        Ganancias Totales
                    </CardTitle>
                    <DollarSign className="h-4 w-4 text-green-500"/>
                </CardHeader>
                <CardContent>
                        <p  className={`text-2xl font-bold ${totalRevenue < 0 ? "text-red-500" : "text-black"}`}>
                            ${totalRevenue}
                            </p>
                        <p className="text-sm text-muted-foreground">Basado en el ultimo mes</p>
                    </CardContent>
            </Card>
            <Card >
                <CardHeader className="flex flex-row items-center justify-between pb-2"> 
                    <CardTitle>
                        Gastos Totales
                    </CardTitle>
                    <DollarSign className="h-4 w-4 text-red-500"/>
                </CardHeader>
                <CardContent>
                        <p className="text-2xl font-bold text-red-500">${totalBills}</p>
                        <p className="text-sm text-muted-foreground">Basado en el ultimo mes</p>
                    </CardContent>
            </Card>
            <Card >
                <CardHeader className="flex flex-row items-center justify-between pb-2"> 
                    <CardTitle>
                        Ventas Totales
                    </CardTitle>
                    <ShoppingCartIcon className="h-4 w-4 text-blue-500"/>
                </CardHeader>
                <CardContent>
                        <p className="text-2xl font-bold">{sales.length}</p>
                        <p className="text-sm text-muted-foreground">Totales desde la creacion de InventoryPlus</p>
                    </CardContent>
            </Card>
            <Card >
                <CardHeader className="flex flex-row items-center justify-between pb-2"> 
                    <CardTitle>
                        Productos
                    </CardTitle>
                    <Package2Icon className="h-4 w-4 text-indigo-500"/>
                </CardHeader>
                <CardContent>
                        <p className="text-2xl font-bold">{productCount.length}</p>
                        <p className="text-sm text-muted-foreground">Total de productos en el inventario</p>
                    </CardContent>
            </Card>
            
        </div>
    )
    
}