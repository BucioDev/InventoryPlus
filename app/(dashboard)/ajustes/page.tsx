import BarcodeScanner from "@/app/components/BarcodeScanner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useState } from "react";

export default function AjustesPage() {
    const [barcode, setBarcode] = useState("");
    return(
        <div>
            <h1>Bienvenido a  Ajustes</h1>
            <Button asChild>
                <Link href="/ajustes/logs">Resgistros de actividad</Link>
            </Button>
            <BarcodeScanner />
            <Input type="text" placeholder="Codigo de barras" 
            value={barcode}
            onChange={(e) => setBarcode(e.target.value)}/>
        </div>
    )
}