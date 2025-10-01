"use client"
import { ToastHandler } from "@/app/components/ToastHandler";
import prisma from "@/app/lib/prisma";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

 

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

export default function InventarioPage() {

    const [barcode, setBarcode] = useState("");
    const [location, setLocation] = useState("");
    const [compatibility, setCompatibility] = useState<string[]>([]);
    const [products, setProducts] = useState<any[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);

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

        const fetchCategories = async () => {
            const res = await fetch("api/categorias");
            const data: Category[] = await res.json();
            setCategories(data);
        }
        fetchCategories().then(fetchProducts);
    }, [debouncedBarcode, debouncedLocation, compatibility]);

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
    return ( 
<div className="grid grid-cols-3 grid-rows-4 gap-4 mt-5">
    <div className="col-span-3 col-start-1">
        <Card>
        <CardHeader>
                <CardTitle>Acciones</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-between">
                <Button asChild><Link href="/inventario/productos/create">Agregar producto</Link></Button>
                <Button asChild><Link href="/inventario/categorias/create">Agregar categoria</Link></Button>
            </CardContent>
        </Card>
    </div>
    <div className="col-span-2 row-span-3 col-start-1 row-start-2">
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
                            <TableHead>Acciones</TableHead>
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
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button size="icon">
                                                <MoreHorizontal className="h-5 w-5" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuLabel>
                                                Acciones
                                            </DropdownMenuLabel>
                                            <DropdownMenuSeparator/>
                                            <DropdownMenuItem asChild><Link href={`/inventario/productos/${product.id}`}>Editar</Link></DropdownMenuItem>
                                            <DropdownMenuItem asChild><Link href={`/inventario/productos/${product.id}/delete`}>Eliminar</Link></DropdownMenuItem>
                                        </DropdownMenuContent>
                                        </DropdownMenu>
                                        </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    </div>
    <div className="row-span-3 col-start-3 row-start-2">
        <Card>
            <CardHeader>
                <CardTitle>Categorias</CardTitle>
                <CardDescription>Categorias de productos</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Nombre</TableHead>
                            <TableHead>Descripcion</TableHead>
                            <TableHead className="text-right">Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {categories.map((cat)=>(
                            <TableRow key={cat.id}>
                                <TableCell>{cat.name}</TableCell>
                                <TableCell>{cat.description}</TableCell>
                                <TableCell className="text-right">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button size="icon">
                                                <MoreHorizontal className="h-5 w-5" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuLabel>
                                                Acciones
                                            </DropdownMenuLabel>
                                            <DropdownMenuSeparator/>
                                            <DropdownMenuItem asChild><Link href={`/inventario/categorias/${cat.id}`}>Editar</Link></DropdownMenuItem>
                                            <DropdownMenuItem asChild><Link href={`/inventario/categorias/${cat.id}/delete`}>Eliminar</Link></DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    </div>
</div>

    )
}