"use client"
import { createClient } from "@/app/actions";
import { SubmitButton } from "@/app/components/SubmitButtons";
import { clientesSchema } from "@/app/lib/zodSchemas";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod/v4";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useActionState, useEffect, useState } from "react";



export default function createClientsPage(){

    const [nombre, setNombre] = useState("PUBLICO GENERAL");
    const [codigo, setCodigo] = useState("");
    const [codigoError, setCodigoError] = useState("");
    const [lastResult, action] = useActionState(createClient, undefined);
    const [count, setCount] = useState(0);

    const [form, fields] = useForm({
        lastResult,
        onValidate({formData}){
            return parseWithZod(formData, {schema:clientesSchema});
        },

        shouldValidate:"onBlur",
        shouldRevalidate:"onInput",
    })

    useEffect(()=>{
        const fetchClientesCount = async () => {
            const res = await fetch("/api/clientescount");
            const count = await res.json();
            setCount(count);
        };

        fetchClientesCount();
    },[]);


        // this code is left here as a reference to how it was suppose to work originaly
    function generateCode() {
        if(nombre == ""){
            setCodigoError("se requiere un nombre para generar el codigo");
        }
        else {
            const partes = nombre.split(" ");
            let code = "";
            for (let i = 0; i < partes.length; i++ ){
                code += partes[i][0].toUpperCase(); 
            }
            const number = count + 1;
            const formatedNumber = String(number).padStart(2,"0");
            code += formatedNumber;
            setCodigo(code);
            setCodigoError("");
        }
        } 


    return (
        <>
        <div className="mt-5">
            <Button asChild>
                <Link href="/clientes">
                    <ChevronLeft/>
                </Link>
            </Button>
        </div>
        <Card className="mt-5">
            <form id={form.id} onSubmit={form.onSubmit} action={action}>
            <CardHeader>
                <CardTitle>
                    Detalles del cliente
                </CardTitle>
                <CardDescription>
                Agregar todos los datos del nuevo cliente
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col gap-6">
                        <div className="flex flex-col gap-3">
                            <Label>Nombre del cliente o empresa</Label>
                            <Input type="text" className="w-full"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            id={fields.nombre.id}
                            name={fields.nombre.name}/>
                            <p className="text-sm text-red-500">{fields.nombre.errors}</p>
                        </div>
                        {/* this button and its code was made since originaly we were going to use a code not the phone number */}
                        <div className="flex flex-col gap-3 hidden">
                            <Button type="button" className="w-md"
                            onClick={generateCode}>
                                Generar Codigo
                                </Button>
                                <p className="text-sm text-red-500">{codigoError}</p>
                        </div>
                        <div className="flex flex-col gap-3">
                            <Label>Numero de telefono de cliente</Label>
                            <Input type="text" className="w-full"
                            inputMode="numeric" pattern="[0-9]*"
                            id={fields.codigo.id} name={fields.codigo.name}
                            onChange={(e) => {e.target.value = e.target.value.replace(/\D/g, ""); }}/>
                            <p className="text-sm text-red-500">{fields.codigo.errors?.[0]}</p>
                        </div>
                        <div className="flex flex-col gap-3">
                            <Label>descuento de cliente</Label>
                            <Input type="number" className="w-full"
                            id={fields.descuento.id}
                            name={fields.descuento.name}/>
                            <p className="text-sm text-red-500">{fields.descuento.errors}</p>
                        </div>
                        <div className="flex flex-col gap-3">
                            <Label>Razon del descuento</Label>
                            <Input type="text" className="w-full"
                            id={fields.razon.id}
                            name={fields.razon.name}/>
                        </div>
                </div>
            </CardContent>
            <CardFooter className="mt-5 justify-end">
                <SubmitButton text="Crear Nuevo Cliente"/>
            </CardFooter>
            </form>
        </Card>
        </>
    )
}