
import { isLoggedIn } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function AjustesPage() {
    const session = await isLoggedIn();
    
    if (session.role == "vendor"){
        redirect("/ordenes");
    }
    return(
        <div>
            <Card className="mt-5">
                <CardHeader>
                    <CardTitle>Bienvenido a  Ajustes</CardTitle>
                </CardHeader>
                <CardContent className="flex  gap-5">
                    <Button asChild>
                        <Link href="/ajustes/logs">Resgistros de actividad</Link>
                    </Button>
                     <Button asChild>
                        <Link href="/ajustes/reportes">Reportes</Link>
                    </Button>
                </CardContent>
            </Card>
        </div>
    )
}