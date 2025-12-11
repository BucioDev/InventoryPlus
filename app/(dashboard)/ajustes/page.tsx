"use client";
import BarcodeScanner from "@/app/components/BarcodeScanner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useState } from "react";

export default function AjustesPage() {
    const [barcode, setBarcode] = useState("");
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