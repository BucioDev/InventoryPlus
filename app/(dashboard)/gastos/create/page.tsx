"use client"
import { createGasto } from "@/app/actions";
import { SubmitButton } from "@/app/components/SubmitButtons";
import { gastosSchema } from "@/app/lib/zodSchemas";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod/v4";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useActionState } from "react";

export default function createGastosPage() {

    const [lastResult, action] = useActionState(createGasto, undefined);
    const [form, fields] = useForm({
        lastResult,
        onValidate({formData}){
            return parseWithZod(formData, {schema: gastosSchema});
        },
        shouldRevalidate:"onBlur",
        shouldValidate:"onInput"
    });
    return(
        <>
        <div className="flex justify-start items-center mt-5">
            <Button asChild>
                <Link href="/gastos">
                <ChevronLeft/>
                </Link>
            </Button>
        </div>
        <Card className="mt-5">
            <CardHeader>
                <CardTitle>
                    Detalles del Gasto
                </CardTitle>
            </CardHeader>
             <form id={form.id} onSubmit={form.onSubmit} action={action} className="flex flex-col gap-4">
            <CardContent>
                <div className="flex flex-col gap-6">
                    <div className="grid gap-3">
                        <Label>Nombre / Razon del Gasto</Label>
                        <Input className="w-full"
                        name={fields.name.name}
                        id={fields.name.id}
                        defaultValue={fields.name.initialValue}
                        />
                        <p className="text-sm text-red-500">{fields.name.errors}</p>
                    </div>
                    <div className="grid gap-3">
                        <Label>Cantidad del Gasto</Label>
                        <Input type="number" className="w-full"
                        name={fields.amount.name}
                        id={fields.amount.id}
                        defaultValue={fields.amount.initialValue}
                        />
                        <p className="text-sm text-red-500">{fields.amount.errors}</p>
                    </div>
                </div>
            </CardContent>
            <CardFooter>
                <SubmitButton text="Agregar Gasto"/>
            </CardFooter>
            </form>
        </Card>
        </>
    )
}