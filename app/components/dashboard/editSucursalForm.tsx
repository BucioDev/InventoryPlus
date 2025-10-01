"use client"
import { editSucursal } from "@/app/actions";
import { sucursalSchema } from "@/app/lib/zodSchemas";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod/v4";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useActionState } from "react";
import { SubmitButton } from "../SubmitButtons";


interface EditSucursalFormProps {
    data:{
        id:string,
        name:string,
        description:string,
        use:string,
    }
}

export default function EditSucursalForm({data}:EditSucursalFormProps) {

    
    const [lastResult, action] = useActionState(editSucursal, undefined);

    const [form, fields] = useForm({
        lastResult,
        onValidate({formData}){
            return parseWithZod(formData, {schema:sucursalSchema})
        },

        shouldValidate:"onBlur",
        shouldRevalidate:"onInput",
    });

    return(
        <>
        <div className="flex items-center mt-5">
            <Button asChild>
                <Link href="/sucursales">
                    <ChevronLeft className="h-5 w-5 " />
                </Link>
            </Button>
        </div>
        <Card className="mt-5">
            <form id={form.id} onSubmit={form.onSubmit} action={action}>
            <CardHeader>
                <CardTitle>Crear nueva sucursal</CardTitle>
                <CardDescription>Agregar los datos de la nueva sucursal</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col gap-6 mt-5">
                    <div className="flex flex-col gap-3">
                        <Label>Nombre o apodo de la sucursal</Label>
                        <Input type="text" className="w-full " 
                        id={fields.name.id}
                        name={fields.name.name}
                        defaultValue={data.name}/>
                    </div>
                    <div className="flex flex-col gap-3">
                        <Label>Descripcion</Label>
                        <Textarea className="w-full " 
                        id={fields.description.id}
                        name={fields.description.name}
                        defaultValue={data.description}/>
                    </div>
                    <div className="flex flex-col gap-3">
                        <Label>Uso de la sucursal</Label>
                        <Select key={fields.use.key} name={fields.use.name} defaultValue={data.use}>
                            <SelectTrigger>
                                <SelectValue placeholder="Selecciona un uso" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="tienda">Tienda</SelectItem>
                                <SelectItem value="almacen">Almacen</SelectItem>
                                <SelectItem value="taller">Taller</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <input type="hidden" name="id" value={data.id} />
                </div>
            </CardContent>
            <CardFooter>
                <div className="mt-5">
                <SubmitButton text="Actualizar Sucursal" />
                </div>
            </CardFooter>
            </form>
        </Card>
        </>
    )
}