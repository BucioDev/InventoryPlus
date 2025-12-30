import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { isLoggedIn } from "../actions";
import { DashboardStats } from "../components/dashboard/DashboardStats";
import { RecentOrders } from "../components/dashboard/RecentOrders";
import SalesChart from "../components/dashboard/SalesChart";


export default async function Dashboard() {
    const session = await isLoggedIn();


    return (
        <>
            <h1>Bienvenido a ControlPlus {session.userName}</h1>
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
