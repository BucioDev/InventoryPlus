"use client"
import { createOrder, editOrder } from "@/app/actions";
import { SubmitButton } from "@/app/components/SubmitButtons";
import { orderSchema } from "@/app/lib/zodSchemas";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod/v4";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useActionState, useEffect, useState } from "react";


function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        // Start a timer when value changes
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        // Clear the timer if value changes again before delay ends
        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
}

type Category = {
    id: string;
    name: string;
    description: string;
    };

    interface EditOrderProps {
  data: {
    id: string;
    nickname: string;
    status: string;
    items: OrderItemData[];
  };
}

    interface OrderItemData {
    productId: string;
    quantity: number;
    priceAtSale: number;
    product: {
        name: string;
    };
    }
    
export default function EditOrderForm({data}: EditOrderProps){

    const [selectedProducts, setSelectedProducts] = useState<
  { product: any; quantity: number; priceAtSale: number }[]
>([]);


    const [barcode, setBarcode] = useState("");
        const [location, setLocation] = useState("");
        const [compatibility, setCompatibility] = useState<string[]>([]);
        const [products, setProducts] = useState<any[]>([]);
        const [categories, setCategories] = useState<Category[]>([]);


        const [lastResult, action] = useActionState(editOrder, undefined);

        const [form, fields] = useForm({
        lastResult,
        onValidate({ formData }) {
            return parseWithZod(formData, { schema: orderSchema });
        },
        shouldValidate: "onBlur",
        shouldRevalidate: "onInput",
        });
    
        // Apply debounce to barcode and location
        const debouncedBarcode = useDebounce(barcode, 500);   // waits 500ms after typing
        const debouncedLocation = useDebounce(location, 500); // waits 500ms after typing
    
        // Fetch products whenever filters change
        useEffect(() => {
            const fetchProducts = async () => {
                const params = new URLSearchParams();
                if (debouncedBarcode) params.append("barcode", debouncedBarcode);
                if (debouncedLocation) params.append("location", debouncedLocation);
                compatibility.forEach(c => params.append("compatibility", c));
    
                const res = await fetch(`/api/products?${params.toString()}`);
                const data = await res.json();
                setProducts(data);
            };
            fetchProducts();
        }, [debouncedBarcode, debouncedLocation, compatibility]);

        useEffect(() => {
        if (data?.items?.length) {
            setSelectedProducts(
            data.items.map(item => ({
                product: {
                id: item.productId,
                name: item.product.name,
                },
                quantity: item.quantity,
                priceAtSale: item.priceAtSale,
            }))
            );
        }
        }, [data.items]);

    
        // Add compatibility tag on Enter
        function handleCompatibilityAdd(e: React.KeyboardEvent<HTMLInputElement>) {
            if (e.key === "Enter") {
                e.preventDefault();
                const value = (e.target as HTMLInputElement).value.trim();
                if (value && !compatibility.includes(value)) {
                    setCompatibility(prev => [...prev, value]);
                }
                (e.target as HTMLInputElement).value = "";
            }
        }



    return(
        <div className="mt-5 flex flex-col gap-6">
            <div className="flex items-start">
                <Button asChild>
                    <Link href="/ordenes">
                    <ChevronLeft />
                    </Link>
                </Button>
            </div>
            <Card >
                <form id={form.id} onSubmit={form.onSubmit} action={action}>
                <CardHeader>
                    <CardTitle>
                        Crear nueva Orden
                    </CardTitle>
                    <CardDescription>
                        Agregar los datos y productos de la orden
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col gap-6">
                        <div className="flex flex-col gap-3">
                            <Label>Nombre o Apodo del cliente </Label>
                            <Input  type="text"
                            name={fields.nickname.name}
                            id={fields.nickname.id}
                            defaultValue={data.nickname}/>
                        </div>
                        <div className="flex flex-col gap-3">
                            <Label> Estado de la orden </Label>
                            <p className="text-sm">Activa - order abierta pero aun no pagada</p>
                            <Select name={fields.status.name} key={fields.status.key} defaultValue={data.status}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Escoger una opcion"/>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="activo"> Activa</SelectItem>
                                    <SelectItem value="completada"> Completada</SelectItem>
                                    <SelectItem value="cancelado"> Cancelada</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex flex-col gap-3">
                            {selectedProducts.length > 0 && (
                                <div className="mt-6">
                                    <Label>Productos agregados a la orden</Label>
                                    <Table>
                                    <TableHeader>
                                        <TableRow>
                                        <TableHead>Producto</TableHead>
                                        <TableHead>Cantidad</TableHead>
                                        <TableHead>Precio Unitario</TableHead>
                                        <TableHead>Total</TableHead>
                                        <TableHead>Acciones</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {selectedProducts.map((item, index) => (
                                        <TableRow key={item.product.id}>
                                            
                                            <TableCell>{item.product.name}</TableCell>
                                            <TableCell>
                                            <Input
                                                type="number"
                                                min={1}
                                                value={item.quantity}
                                                name={`items[${index}].quantity`}
                                                onChange={e => {
                                                const newQuantity = parseInt(e.target.value, 10);
                                                setSelectedProducts(prev => {
                                                    const updated = [...prev];
                                                    updated[index].quantity = newQuantity;
                                                    return updated;
                                                });
                                                }}
                                            />
                                            <input
                                                type="hidden"
                                                name={`items[${index}].productId`}
                                                value={item.product.id}
                                                />
                                            </TableCell>
                                            <TableCell>
                                            <Input
                                                type="number"
                                                value={item.priceAtSale}
                                                name={`items[${index}].priceAtSale`}
                                                onChange={e => {
                                                const newPrice = parseFloat(e.target.value);
                                                setSelectedProducts(prev => {
                                                    const updated = [...prev];
                                                    updated[index].priceAtSale = newPrice;
                                                    return updated;
                                                });
                                                }}
                                            />
                                            </TableCell>
                                            <TableCell>
                                            ${(item.quantity * item.priceAtSale).toFixed(2)}
                                            </TableCell>
                                            <TableCell>
                                            <Button
                                                variant="destructive"
                                                onClick={() => {
                                                setSelectedProducts(prev =>
                                                    prev.filter(p => p.product.id !== item.product.id)
                                                );
                                                }}
                                            >
                                                Eliminar
                                            </Button>
                                            </TableCell>
                                        </TableRow>
                                        ))}
                                    </TableBody>
                                    </Table>
                                </div>
                                )}

                        </div>
                        <div className="mt-4 flex justify-end">
                            <Label className="text-lg">
                                Subtotal de la orden:{" "}
                                <span className="font-bold">
                                ${selectedProducts.reduce((sum, item) => sum + item.quantity * item.priceAtSale, 0).toFixed(2)}
                                </span>
                            </Label>
                            </div>
                            <input type="hidden" name="id" value={data.id}/>
                    </div>
                </CardContent>
                <CardFooter className="flex justify-end mt-5">
                    <SubmitButton text="Actualizar orden" />
                </CardFooter>
                </form>

            </Card>

            <Card>
            <CardHeader>
                <CardTitle>Productos</CardTitle>
                <CardDescription>
                    <div className="flex gap-3 mt-3">
                        <Input
                            placeholder="Buscar por Codigo de barras"
                            value={barcode}
                            onChange={e => setBarcode(e.target.value)}
                        />
                        <Input
                            placeholder="Buscar por localizacion"
                            value={location}
                            onChange={e => setLocation(e.target.value)}
                        />

                        <Input
                            placeholder="Escribe compatibilidad y presionar ENTER"
                            onKeyDown={handleCompatibilityAdd}
                        />
                        </div>
                        <div className="flex gap-2 flex-wrap">
                            {compatibility.map(c => (
                            <Button
                                key={c}
                                variant="secondary"
                                onClick={() => setCompatibility(prev => prev.filter(x => x !== c))}
                            >
                                {c} ✕
                            </Button>
                            ))}
                    </div>
                    
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Nombre</TableHead>
                            <TableHead>Codigo de barras</TableHead>
                            <TableHead>Categoria</TableHead>
                            <TableHead>Compatibilidad</TableHead>
                            <TableHead>Marca</TableHead>
                            <TableHead>Ubicacion</TableHead>
                            <TableHead>Variante</TableHead>
                            <TableHead>Stock</TableHead>
                            <TableHead>Precio de compra</TableHead>
                            <TableHead>Precio de venta</TableHead>
                            <TableHead className="text-right">Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {products.map((product) => (
                            <TableRow key={product.id}>
                                <TableCell>{product.name}</TableCell>
                                <TableCell>{product.barcode}</TableCell>
                                <TableCell>{product.category.name}</TableCell>
                                <TableCell>{product.compatibility.join(', ')}</TableCell>
                                <TableCell>{product.brand}</TableCell>
                                <TableCell>{product.location}</TableCell>
                                <TableCell>{product.variant}</TableCell>
                                <TableCell>{product.stock}</TableCell>
                                <TableCell>{product.buyprice}</TableCell>
                                <TableCell>{product.sellprice}</TableCell>
                                <TableCell className="text-right">
                                    <Button
                                        onClick={() => {
                                            const exists = selectedProducts.find(p => p.product.id === product.id);
                                            if (!exists) {
                                            setSelectedProducts(prev => [
                                                ...prev,
                                                {
                                                product,
                                                quantity: 1,
                                                priceAtSale: product.sellprice, // default to current sell price
                                                },
                                            ]);
                                            }
                                        }}
                                        >
                                        Agregar producto a orden
                                        </Button>
                                        </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
        </div>
    )
}