"use client"
import { editProveedor } from "@/app/actions";
import { SubmitButton } from "@/app/components/SubmitButtons";
import { proveedoresSchema } from "@/app/lib/zodSchemas";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod/v4";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useActionState } from "react";

interface EditProveedoresFormProps {
    data:{
        id:string,
        companyName: string,
        companyPhone: string | null,
        companyEmail: string | null,
        contactName: string | null,
        contactPhone: string | null,
        contactEmail: string | null,
    }
}

export default function EditProveedorForm({data}:EditProveedoresFormProps){

    const [lastResult, action] = useActionState(editProveedor, undefined);

    const [form, fields] = useForm({
        lastResult,
        onValidate({formData}){
            return parseWithZod(formData,{schema: proveedoresSchema});
        },

        shouldValidate:"onBlur",
        shouldRevalidate:"onInput",
    })


    return(
        <>
        <div className="mt-5">
            <Button asChild>
                <Link href="/proveedores">
                    <ChevronLeft/>
                </Link>
            </Button>
        </div>
        <Card className="mt-5">
            <CardHeader>
                <CardTitle>Crear un nuevo proveedor</CardTitle>
                <CardDescription>Agregar los datos del proveedor</CardDescription>
            </CardHeader>
            <form id={form.id} onSubmit={form.onSubmit} action={action}>
                <CardContent>
                    <div className="flex flex-col gap-6">
                        <div className="flex flex-col gap-3">
                            <Label>Nombre de compañia</Label>
                            <p className="text-sm">si es una persona usar el nombre de la misma</p>
                            <Input className="w-full"
                            id={fields.companyName.id}
                            name={fields.companyName.name}
                            defaultValue={data.companyName}
                            />
                            <p className="text-red-500 text-sm">{fields.companyName.errors}</p>
                        </div>
                        <div className="flex flex-col gap-3">
                            <Label>Telefono de la compañia</Label>
                            <Input className="w-full"
                            id={fields.companyPhone.id}
                            name={fields.companyPhone.name}
                            defaultValue={data.companyPhone || ""}
                            />
                        </div>
                        <div className="flex flex-col gap-3">
                            <Label>Correo de la compañia</Label>
                            <Input className="w-full"
                            id={fields.companyEmail.id}
                            name={fields.companyEmail.name}
                            defaultValue={data.companyEmail || ""}
                            />
                        </div>
                        <div className="flex flex-col gap-3">
                            <Label>Nombre del Contacto</Label>
                            <p className="text-sm">Puede ser el mismo que nombre de compañia</p>
                            <Input className="w-full"
                            id={fields.contactName.id}
                            name={fields.contactName.name}
                            defaultValue={data.contactName || ""}
                            />
                            <p className="text-red-500 text-sm">{fields.contactName.errors}</p>
                        </div>
                        <div className="flex flex-col gap-3">
                            <Label>Telefono del Contacto</Label>
                            <Input className="w-full"
                            id={fields.contactPhone.id}
                            name={fields.contactPhone.name}
                            defaultValue={data.contactPhone || ""}
                            />
                        </div>
                        <div className="flex flex-col gap-3">
                            <Label>Correo del Contacto</Label>
                            <Input className="w-full"
                            id={fields.contactEmail.id}
                            name={fields.contactEmail.name}
                            defaultValue={data.contactEmail || ""}
                            />
                        </div>
                        <input type="hidden" value={data.id} name="id" id="id"/>
                    </div>
                </CardContent>
                <CardFooter className="mt-5">
                    <SubmitButton text="Actualizar proveedor"/>
                </CardFooter>
            </form>
        </Card>
        </>
    )
}