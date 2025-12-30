import prisma from "@/app/lib/prisma";
import { Avatar } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

async function getOrders(){
    const data = await prisma.order.findMany({
        where:{
            status:"completada"
        },
        orderBy:{
            createdAt:"desc"
        },
        select:{
            id:true,
            nickname:true,
            total:true,
            items:{
                select:{
                    quantity:true
                }
            }
        },
        take:10,

    })

    const result = data.map(order => {
        const totalQuantity = order.items.reduce((sum, item) => sum + item.quantity, 0);
        return {
            ...order,
            totalQuantity
        };
    });

    return result;
}

export async function RecentOrders() {
    const orders = await getOrders();
    return(
        <Card>
            <CardHeader>
                <CardTitle>
                    Ventas Recientes
                </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-8">
                <div className="flex flex-col gap-4 ">
                    {orders.map((order)=>(
                        <div key={order.id} className="flex items-start gap-4 justify-between border-b-2">
                        <h1>{order.nickname}</h1>
                        <p className="text-sm font-medium">Cantidad de productos: {order.totalQuantity}</p>
                        <p className="ml-auto font-medium">$ {order.total}</p>
                        </div>
                    
                    ))}
                    

                </div>
            </CardContent>
        </Card>
    )
    
}