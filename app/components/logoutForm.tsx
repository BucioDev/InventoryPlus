
import { Button } from "@/components/ui/button";
import { logout } from "../actions";



export default function LogoutForm() {
    return (
        <>
        <form action={logout} >
        <Button type="submit" variant="destructive" >
            Cerrar Session
        </Button>
        </form>

        
        </>
    )
}