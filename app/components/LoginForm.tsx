"use client"
import { useActionState } from "react";
import { login } from "../actions";
import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod/v4";
import { loginSchema } from "../lib/zodSchemas";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { SubmitButton } from "./SubmitButtons";

export default function LoginForm() {

    const [lastResult, action] = useActionState(login, undefined);
    const [form, fields] = useForm({
        lastResult,
        onValidate({formData}){
            return parseWithZod(formData, {schema: loginSchema});
        },

        shouldValidate:"onBlur",
        shouldRevalidate:"onInput",
    })
    return (
        <div className="h-[80vh] w-full flex items-center justify-center">
            <form id={form.id} onSubmit={form.onSubmit} action={action}>
            <Card className="w-full max-w-3xl ">
                <CardHeader>
                    <CardTitle className="flex justify-center">Ingrese sus datos para acceder</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col gap-6">
                        <div className="flex flex-col gap-3">
                        <Label>Usuario</Label>
                        <Input type="text" className="w-full" placeholder="Usuario"
                        key={fields.username.key}
                        name={fields.username.name}/>
                        </div>
                        <div className="flex flex-col gap-3">
                        <Label>Contraseña</Label>
                        <Input type="password" className="w-full" placeholder="Contraseña"
                        key={fields.password.key}
                        name={fields.password.name}/>
                        </div>
                        <p className="text-red-500">{form.errors}</p>
                    </div>
                </CardContent>
                <CardFooter className="flex justify-center ">
                    <SubmitButton text="Login"/>
                </CardFooter>
            </Card>
        </form> 
        </div>
          
        )
}