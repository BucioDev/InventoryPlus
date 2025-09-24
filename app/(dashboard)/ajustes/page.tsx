import BarcodeScanner from "@/app/components/BarcodeScanner";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function AjustesPage() {
    return(
        <div>
            <h1>Bienvenido a  Ajustes</h1>
            <Button asChild>
                <Link href="/ajustes/logs">Resgistros de actividad</Link>
            </Button>
            <BarcodeScanner />
        </div>
    )
}