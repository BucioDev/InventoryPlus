"use client"
import { createProduct } from "@/app/actions";
import BarcodeScanner from "@/app/components/BarcodeScanner";
import { SubmitButton } from "@/app/components/SubmitButtons";
import { TagInput } from "@/app/components/TagsInput";
import { UploadDropzone } from "@/app/lib/uploadthing";
import { productSchema } from "@/app/lib/zodSchemas";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod/v4";
import { ChevronLeft, XIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useActionState, useEffect, useState } from "react";


type Category = {
    id: string;
    name: string;
  };

export default function CreateProductPage() {

    const [barcode, setBarcode] = useState("");

    const [images, setImages] = useState<string[]>([]);
    //fetching categories
    const [categorys, setCategorys] = useState<Category[]>([]);

    useEffect(() => {
        const fetchCategorys = async () => {
            const res = await fetch("/api/categorias");
            const data: Category[] = await res.json();
            setCategorys(data)
        };
        fetchCategorys();
    }, [])

    const [lastResult, action] = useActionState(createProduct, undefined);

    const [form, fields] = useForm({
        lastResult,
        onValidate({formData}){
            return parseWithZod(formData, {schema:productSchema})
        },

        shouldValidate:"onBlur",
        shouldRevalidate:"onInput",
    });

    const handleDelete = (index: number) => {
        //the _ is to ignore the warning, since we are not using that argument
        setImages(images.filter((_, i) => i !== index));
    }

    

    return(
        <div className=" max-w-7xl mx-auto mt-5 px-4 sm:px-6 lg:px-8">
            <Button asChild>
                <Link href="/inventario">
                    <ChevronLeft className="h-5 w-5 " />
                </Link>
            </Button>
            <form id={form.id} onSubmit={form.onSubmit} action={action}>
            <Card className="mt-5">
                <CardHeader>
                    <CardTitle>Crear un nuevo producto</CardTitle>
                    <CardDescription>Agregar los datos del nuevo producto</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col gap-6">
                        <div className="flex flex-col gap-3">
                            <Label>Nombre del producto</Label>
                            <Input type="text" placeholder="ex: Llantas"
                            key={fields.name.key}
                            name={fields.name.name}
                            defaultValue={fields.name.initialValue}/>
                            <p className="text-red-500">{fields.name.errors}</p>
                        </div>
                        <div className="flex flex-col gap-3">
                            <Label>Codigo de barras</Label>
                            <Input type="text" placeholder=""
                            key={fields.barcode.key}
                            name={fields.barcode.name}
                            defaultValue={fields.barcode.initialValue}
                            value={barcode}
                            onChange={(e) => setBarcode(e.target.value)}/>
                            <div className="flex md:hidden">
                            <BarcodeScanner onDetected={(code) => setBarcode(code)} />
                            </div>
                            <p className="text-red-500">{fields.barcode.errors}</p>
                        </div>
                        <div className="flex flex-col gap-3"> 
                            <Label>Categoria del producto</Label>
                            <Select key={fields.categoryId.key} name={fields.categoryId.name} defaultValue={fields.categoryId.initialValue}> 
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecciona una categoria" />
                                </SelectTrigger>
                                <SelectContent>
                                    {categorys.map((category) =>(
                                        <SelectItem key={category.id} value={category.id}>{category.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <p className="text-red-500">{fields.categoryId.errors}</p>
                        </div>
                        <div className="flex flex-col gap-3"> 
                            <Label>Marca del producto</Label>
                            <Input type="text" placeholder="Michelin"
                            key={fields.brand.key}
                            name={fields.brand.name}
                            defaultValue={fields.brand.initialValue}/>
                            <p className="text-red-500">{fields.brand.errors}</p>
                        </div>
                        <div className="flex flex-col gap-3"> 
                            <Label>Compatibilidad del prodcuto</Label> {/* TODO: Crear un TagInput para poder agregar mas de una compatibilidad */}
                            <TagInput
                                name={fields.compatibility.name}
                                defaultValue={fields.compatibility.initialValue as string[]}
                                key={fields.compatibility.key}
                                />
                            <p className="text-red-500">{fields.compatibility.errors}</p>
                        </div>
                        <div className="flex flex-col gap-3"> 
                            <Label>Lugar donde se encuentra el producto</Label>
                            <Input type="text" placeholder="Taller"
                            key={fields.location.key}
                            name={fields.location.name}
                            defaultValue={fields.location.initialValue}/>
                            <p className="text-red-500">{fields.location.errors}</p>
                        </div>
                        <div className="flex flex-col gap-3"> 
                            <Label>Variante del product</Label>
                            <Input type="text" placeholder="Ej: Color"
                            key={fields.variant.key}
                            name={fields.variant.name}
                            defaultValue={fields.variant.initialValue}/>
                            <p className="text-red-500">{fields.variant.errors}</p>
                        </div>
                        <div className="flex flex-col gap-3"> 
                            <Label>Cantidad del producto</Label>
                            <p className="text-xs text-gray-500">Recuerde que esta es la cantidad del producto en un lugar</p>
                            <Input type="number" placeholder="15"
                            key={fields.stock.key}
                            name={fields.stock.name}
                            defaultValue={fields.stock.initialValue}/>
                            <p className="text-red-500">{fields.stock.errors}</p>
                        </div>
                        <div className="flex flex-col gap-3"> 
                            <Label>Cantidad para alerta del producto</Label>
                            <p className="text-xs text-gray-500">Recuerde que si el stock del producto es menor a esta cantidad, se enviara un mensaje de alerta</p>
                            <Input type="number" placeholder="15"
                            key={fields.alertammount.key}
                            name={fields.alertammount.name}
                            defaultValue={fields.alertammount.initialValue}/>
                            <p className="text-red-500">{fields.alertammount.errors}</p>
                        </div>
                        <div className="flex flex-col gap-3"> 
                            <Label>Precio de compra del producto</Label>
                            <p className="text-xs text-gray-500">Precio al que se compro el producto</p>
                            <Input type="number" placeholder="15"
                            key={fields.buyprice.key}
                            name={fields.buyprice.name}
                            defaultValue={fields.buyprice.initialValue}/>
                            <p className="text-red-500">{fields.buyprice.errors}</p>
                        </div>
                        <div className="flex flex-col gap-3"> 
                            <Label>Precio de venta del producto</Label>
                            <p className="text-xs text-gray-500">Precio al que se vendera el producto</p>
                            <Input type="number" placeholder="15"
                            key={fields.sellprice.key}
                            name={fields.sellprice.name}
                            defaultValue={fields.sellprice.initialValue}/>
                            <p className="text-red-500">{fields.sellprice.errors}</p>
                        </div>
                        <div className="flex flex-col gap-3">
                        <Label>Images</Label>
                        <input type="hidden" value={images} key={fields.images.key} name={fields.images.name} defaultValue={fields.images.initialValue as any} />
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
                            endpoint="imageUploader" 
                            onClientUploadComplete={(res) =>{
                                setImages(res.map((r)=> r.url));
                            }}
                            onUploadError={() =>{
                                alert("file uploading error");
                            }}/>
                        )}

                        <p className="text-red-500">{fields.images.errors}</p>
                    </div>
                    </div>
                </CardContent>
                <CardFooter>
                    <SubmitButton text="Crear Producto" />
                </CardFooter>
            </Card>
            </form>
        </div>
    )
}