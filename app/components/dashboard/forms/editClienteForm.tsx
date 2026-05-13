"use client"
import { editClient } from "@/app/actions";
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
import { useActionState, useState } from "react";

interface Clienteprops {
    data:{
        id:string,
        nombre:string,
        codigo:string,
        descuento:number,
        Razon:string | null,
    }
}



export default function EditClienteForm({data}:Clienteprops){

    const [nombre, setNombre] = useState(data.nombre);
    const [codigo, setCodigo] = useState(data.codigo);
    const [codigoError, setCodigoError] = useState("");
    const [lastResult, action] = useActionState(editClient, undefined);

    const [form, fields] = useForm({
        lastResult,
        onValidate({formData}){
            return parseWithZod(formData, {schema:clientesSchema});
        },

        shouldValidate:"onBlur",
        shouldRevalidate:"onInput",
    })



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
            code += "01"
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
                            defaultValue={codigo}
                            id={fields.codigo.id} name={fields.codigo.name}
                            onChange={(e) => {e.target.value = e.target.value.replace(/\D/g, ""); }}/>
                            <p className="text-sm text-red-500">{fields.codigo.errors}</p>
                        </div>
                        <div className="flex flex-col gap-3">
                            <Label>descuento de cliente</Label>
                            <Input type="number" className="w-full"
                            defaultValue={data.descuento}
                            id={fields.descuento.id}
                            name={fields.descuento.name}/>
                            <p className="text-sm text-red-500">{fields.descuento.errors}</p>
                        </div>
                        <div className="flex flex-col gap-3">
                            <Label>Razon del descuento</Label>
                            <Input type="text" className="w-full"
                            defaultValue={data.Razon || ""}
                            id={fields.razon.id}
                            name={fields.razon.name}/>
                        </div>
                        <input type="hidden"
                        value={data.id} id="id" name="id"/>
                </div>
            </CardContent>
            <CardFooter className="mt-5 justify-end">
                <SubmitButton text="Actualizar Cliente"/>
            </CardFooter>
            </form>
        </Card>
        </>
    )
}