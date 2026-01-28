import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { isLoggedIn } from "../actions";
import { DashboardStats } from "../components/dashboard/DashboardStats";
import { RecentOrders } from "../components/dashboard/RecentOrders";
import SalesChart from "../components/dashboard/SalesChart";
import { Button } from "@/components/ui/button";
import Link from "next/link";


export default async function Dashboard() {
    const session = await isLoggedIn();


    return (
        <>
        <div className="flex justify-between items-center mt-5">
            <h1>Bienvenido a ControlPlus {session.userName}</h1>

            {session.role == "admin" && 
            <Button asChild>
                <Link href="/gastos">
                Lista de Gastos
                </Link>
            </Button>}
        </div>
            <DashboardStats />
            <div className="grid gap-4 md:gap-8 ld:grid-cols2 xl:grid-cols-3 mt-10">
                <Card className="xl:col-span-2">
                    <CardHeader>
                        <CardTitle>Movimientos de los ultimos 7 dias</CardTitle>
                        <CardDescription></CardDescription>
                    </CardHeader>
                    <CardContent>
                        <SalesChart />
                    </CardContent>
                </Card>
                <RecentOrders/>
            </div>
        </>
    )
}
