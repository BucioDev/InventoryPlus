"use server"
import { hasShiftOpen, isLoggedIn, openShift } from "@/app/actions";
import { SubmitButton } from "@/app/components/SubmitButtons";
import ShiftCheck from "@/app/components/dashboard/ShiftCheck";
import LogoutForm from "@/app/components/logoutForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";



export default async function IniciarTurnoPage() {
    const session = await isLoggedIn();
    const id = session.userId
    return (
        <div className="h-[80vh] w-full flex items-center justify-center">
            <ShiftCheck />
            <Card className="w-full max-w-2xl">
                <CardHeader>
                    <CardTitle>Abrir turno para poder trabajar</CardTitle>
                    <CardDescription></CardDescription>
                </CardHeader>
                <CardContent className="w-full flex justify-between">
                    <LogoutForm/>
                        <form action={openShift}>
                            <input type="hidden" name="userId" value={id}/>
                            <SubmitButton text="Abrir Turno"/>
                        </form>
                    </CardContent>
            </Card>
        </div>
    )
}