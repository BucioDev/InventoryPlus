import { isLoggedIn } from "@/app/actions";
import { SubmitButton } from "@/app/components/SubmitButtons";
import LogoutForm from "@/app/components/logoutForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";



export default async function IniciarTurnoPage() {
    const session = await isLoggedIn();
    const id = session.userId
    return (
        <div className="h-[80vh] w-full flex items-center justify-center">
            <Card className="w-full max-w-2xl">
                <CardHeader>
                    <CardTitle>Estas a punto de Cerrar tu turno estas seguro que esto es lo que quieres hacer?</CardTitle>
                    <CardDescription>recuerda impimir el ticket de ventas antes de cerrar turno</CardDescription>
                </CardHeader>
                <CardContent className="w-full flex justify-between">
                    <LogoutForm/>
                    <form>
                            <input type="hidden" name="userId" value={id}/>
                            <SubmitButton text="Imprimir recivo de ventas"/>
                        </form>
                        <form>
                            <input type="hidden" name="userId" value={id}/>
                            <SubmitButton text="Cerrar Turno"/>
                        </form>
                    </CardContent>
            </Card>
        </div>
    )
}