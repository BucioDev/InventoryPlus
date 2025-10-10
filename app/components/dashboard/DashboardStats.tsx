import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Car, DollarSign, Package2Icon, ShoppingCartIcon } from "lucide-react";



export async function DashboardStats() {
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
                        <p className="text-2xl font-bold">600$</p>
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
                        <p className="text-2xl font-bold">45</p>
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
                        <p className="text-2xl font-bold">122</p>
                        <p className="text-sm text-muted-foreground">Total de productos en el inventario</p>
                    </CardContent>
            </Card>
            
        </div>
    )
    
}