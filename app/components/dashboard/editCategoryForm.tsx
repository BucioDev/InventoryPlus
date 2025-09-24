"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ChevronLeft } from "lucide-react"
import Link from "next/link"
import { SubmitButton } from "../SubmitButtons"
import { useActionState, useEffect } from "react"
import { useForm } from "@conform-to/react"
import { categorySchema } from "@/app/lib/zodSchemas"
import { parseWithZod } from "@conform-to/zod/v4"
import { editCategory } from "@/app/actions"
import { toast } from "sonner"


interface EditCategoryFormProps {
    data:{
        id:string,
        name:string,
        description:string,
    }
}



export default function EditCategoryForm({data}:EditCategoryFormProps) {


    const [lastResult, action] = useActionState(editCategory, undefined);

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
                        defaultValue={data.name}/>
                        <p className="text-red-500">{fields.name.errors}</p>
                    </div>
                    <div className="flex flex-col gap-3">
                        <Label>Descripcion de la categoria</Label>
                        <Input type="text" placeholder="Llantas de motocicletas y otros"
                        key={fields.description.key}
                        name={fields.description.name}
                        defaultValue={data.description}/>
                    </div>
                    <input type="hidden" name="id" value={data.id} />
                </div>
            </CardContent>
            <CardFooter>
                <SubmitButton text="Actualizar Categoria" />
            </CardFooter>
        </Card>
        </form>
        </div>
    )
}