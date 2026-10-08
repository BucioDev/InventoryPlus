import { closeShift, isLoggedIn } from "@/app/actions";
import { SubmitButton } from "@/app/components/SubmitButtons";
import LogoutForm from "@/app/components/logoutForm";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";



export default async function IniciarTurnoPage() {
    const session = await isLoggedIn();
    const id = session.userId
    return (
        <div className="h-[80vh] w-full flex items-center justify-center">
            <Card className="w-full max-w-2xl">
                <CardHeader>
                    <CardTitle>Se detectado un turno de mas de 15hr por favor cierra turno, y abre uno nuevo</CardTitle>
                    <CardDescription></CardDescription>
                </CardHeader>
                <CardContent className="w-full flex justify-between">
                    <LogoutForm/>
                    <Button asChild>
                        <Link href="/turno/terminar">Cerrar turno</Link>
                    </Button>
                    </CardContent>
            </Card>
        </div>
    )
}