"use client"
import { userSchemaWithoutPass } from "@/app/lib/zodSchemas";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { parseWithZod } from "@conform-to/zod/v4";
import { ChevronLeft, XIcon } from "lucide-react";
import Link from "next/link";
import { useActionState, useState } from "react";
import { SubmitButton } from "../SubmitButtons";
import { editUser } from "@/app/actions";
import { useForm } from "@conform-to/react";
import { UploadDropzone } from "@/app/lib/uploadthing";
import Image from "next/image";


interface EditUserFormProps {
    data:{
        id:string,
        username:string,
        firstName:string,
        lastName:string | null,
        role:string,
        img:string | null,
    }
}



export default function EditUserForm({data}:EditUserFormProps) {

    const [images, setImages] = useState<string[]>([]);

    const [lastResult, action] = useActionState(editUser, undefined);

    const [form, fields] = useForm({
        lastResult,
        onValidate({formData}){
            return parseWithZod(formData, {schema: userSchemaWithoutPass});
        },

        shouldValidate:"onBlur",
        shouldRevalidate:"onInput",
    })
    const handleDelete = (index: number) => {
        //the _ is to ignore the warning, since we are not using that argument
        setImages(images.filter((_, i) => i !== index));
    }
    return (
        <form id={form.id} onSubmit={form.onSubmit} action={action} className="flex flex-col gap-4">
            <div className="flex items-center gap-4 mt-5">
                <Button variant="default" size="icon" asChild>
                    <Link href="/usuarios">
                    <ChevronLeft className="h-5 w-5" />
                    </Link>
                </Button>
            </div>
            <Card className="mt-5">
                <CardHeader>
                    <CardTitle>Detalles del Usuario</CardTitle>
                    <CardDescription>Agregar todos los datos del nuevo usuario</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col gap-6">
                        <div className="flex flex-col gap-3">
                            <Label>Apodo de usuario</Label>
                            <Input type="text" className="w-full" placeholder="Usuario para acceder a la cuenta" 
                            key={fields.username.key}
                            name={fields.username.name}
                            defaultValue={data.username}/>
                            <p className="text-red-500">{fields.username.errors}</p>
                        </div>
                        <div className="flex flex-col gap-3">
                            <Label>Nombre de usuario</Label>
                            <Input type="text" className="w-full" placeholder="Nombre de usuario" 
                            key={fields.firstname.key}
                            name={fields.firstname.name}
                            defaultValue={data.firstName}/>
                            <p className="text-red-500">{fields.firstname.errors}</p>
                        </div>
                        <div className="flex flex-col gap-3">
                            <Label>Apellidos del usuario</Label>
                            <Input type="text" className="w-full" placeholder="Apellidos del usuario" 
                            key={fields.lastname.key}
                            name={fields.lastname.name}
                            defaultValue={data.lastName || ""}/>
                            <p className="text-red-500">{fields.lastname.errors}</p>
                        </div>
                        <div className="flex flex-col gap-3">
                            <Label>Rol del Usuario</Label>
                            <Select key={fields.role.key} name={fields.role.name} defaultValue={data.role}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Seleccione un rol" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="admin">Administrador</SelectItem>
                                    <SelectItem value="vendor">Vendedor</SelectItem>
                                    <SelectItem value="user">Usuario General</SelectItem>
                                </SelectContent>
                            </Select>
                            <p className="text-red-500">{fields.role.errors}</p>
                        </div>
                        <div className="flex flex-col gap-3">
                        <Label>Images</Label>
                        <input type="hidden" value={images} key={fields.img.key} name={fields.img.name} defaultValue={fields.img.initialValue as any} />
                        {images.length > 0 ? (
                            <div className="flex gap-5">
                                {images.map((image, index) => (
                                    <div key={index} className="relative w-[100px] h-[100px]">
                                        <Image height={100} width={100} src={image} alt="product image" 
                                        className="w-full h-full object-cover rounded-lg border"
                                        />
                                        <button 
                                        onClick={() => handleDelete(index)}
                                        type="button" 
                                        className="absolute -top-3 -right-3 bg-red-500 p-2 rounded-lg text-white">
                                            <XIcon className="w-3 h-3" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        ): (
                            <UploadDropzone 
                            endpoint="profileImageUploader" 
                            onClientUploadComplete={(res) =>{
                                setImages(res.map((r)=> r.url));
                            }}
                            onUploadError={() =>{
                                alert("file uploading error");
                            }}/>
                        )}

                        <p className="text-red-500">{fields.img.errors}</p>
                    </div>
                        <input type="hidden" name="id" value={data.id} />
                    </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                <SubmitButton text="Guardar datos de Usuario" />
            </CardFooter>
            </Card>
        </form>
    )
}
