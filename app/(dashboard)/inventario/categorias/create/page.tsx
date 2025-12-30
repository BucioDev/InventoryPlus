"use client"
import { createCategory } from "@/app/actions";
import { SubmitButton } from "@/app/components/SubmitButtons";
import { categorySchema } from "@/app/lib/zodSchemas";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod/v4";
import { Label } from "@radix-ui/react-label";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useActionState } from "react";

export default function CreateCategory() {

    const [lastResult, action] = useActionState(createCategory, undefined);

    const [form, fields] = useForm({
        lastResult,
        onValidate({formData}){
            return parseWithZod(formData, {schema:categorySchema});
        },
        
        shouldValidate:"onBlur",
        shouldRevalidate:"onInput",
    })
    return ( 
        <div className=" max-w-7xl mx-auto mt-5 px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-4">
            <Button asChild>
                <Link href="/inventario">
                    <ChevronLeft className="h-5 w-5 " />
                </Link>
            </Button>
            </div>
            <form  onSubmit={form.onSubmit} id={form.id} action={action}>
        <Card className="mt-5">
            <CardHeader>
                <CardTitle>Crear una nueva categoria</CardTitle>
                <CardDescription>Agregar los datos de la nueva categoria para los productos</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col gap-6">
                    <div className="flex flex-col gap-3">
                        <Label>Nombre de la categoria</Label>
                        <Input type="text" placeholder="ex: Llantas"
                        key={fields.name.key}
                        name={fields.name.name}
                        defaultValue={fields.name.initialValue}/>
                        <p className="text-red-500">{fields.name.errors}</p>
                    </div>
                    <div className="flex flex-col gap-3">
                        <Label>Descripcion de la categoria</Label>
                        <Input type="text" placeholder="Llantas de motocicletas y otros"
                        key={fields.description.key}
                        name={fields.description.name}
                        defaultValue={fields.description.initialValue}/>
                    </div>
                </div>
            </CardContent>
            <CardFooter>
                <SubmitButton text="Crear Categoria" />
            </CardFooter>
        </Card>
        </form>
        </div>
    )
}