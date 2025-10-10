import { Avatar } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";



export async function RecentOrders() {

    return(
        <Card>
            <CardHeader>
                <CardTitle>
                    Ventas Recientes
                </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-8">
                <div className="flex items-center gap-4 justify-between">
                    <h1>Pedro</h1>
                    <div className="flex items-center justify-between gap-4">
                        <p className="text-sm font-medium">Cantidad de productos</p>
                        <p className="text-xl font-bold text-center">4</p>
                    </div>
                    <p className="ml-auto font-medium">$ 1200</p>

                </div>
            </CardContent>
        </Card>
    )
    
}