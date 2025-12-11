"use client"
import AddStockForm from "@/app/components/dashboard/forms/AddStockForm";
import TransfertockForm from "@/app/components/dashboard/forms/TransferStockForm";
import { ToastHandler } from "@/app/components/ToastHandler";
import prisma from "@/app/lib/prisma";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ChevronRight, MoreHorizontal, PlusCircle } from "lucide-react";
import Image from "next/image";
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
    const [name, setName] = useState("");
    const [location, setLocation] = useState("");
    const [compatibility, setCompatibility] = useState<string[]>([]);
    const [products, setProducts] = useState<any[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);

    const [currentPage, setCurrentPage] = useState(1);
        const itemsPerPage = 25;

        const totalPages = Math.ceil(products.length / itemsPerPage);

        const paginatedProducts = products.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
        );


    // Apply debounce to barcode and location
    const debouncedBarcode = useDebounce(barcode, 500);   // waits .5s after typing
    const debounceName = useDebounce(name, 500)
    const debouncedLocation = useDebounce(location, 500); 

    // Fetch products whenever filters change
    useEffect(() => {
        const fetchProducts = async () => {
            const params = new URLSearchParams();
            if (debouncedBarcode) params.append("barcode", debouncedBarcode);
            if (debounceName) params.append("name",debounceName);
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
    }, [debouncedBarcode, debounceName, debouncedLocation, compatibility]);

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
<div className="grid  gap-4 mt-5">
    <div className="col-span-3 col-start-1">
        <Card>
        <CardHeader>
                <CardTitle>Acciones</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-between">
                <Button asChild><Link href="/inventario/productos/create"><PlusCircle/> Agregar producto </Link></Button>
                <Button asChild><Link href="/inventario/categorias"> Ver categorias <ChevronRight/></Link></Button>
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
                            placeholder="Buscar por Nombre del producto"
                            value={name}
                            onChange={e => setName(e.target.value)}
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
            <TableHead>Image</TableHead>
            <TableHead>Nombre</TableHead>
            <TableHead>Codigo de barras</TableHead>
            <TableHead>Categoria</TableHead>
            <TableHead>Compatibilidad</TableHead>
            <TableHead>Marca</TableHead>
            <TableHead>Ubicacion</TableHead>
            <TableHead>Notas</TableHead>
            <TableHead>Variante</TableHead>
            <TableHead>Stock</TableHead>
            <TableHead>Precio de compra</TableHead>
            <TableHead>Precio de venta</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {paginatedProducts.map((product) => (
            <TableRow key={product.id}>
              <TableCell>
                <Image
                  alt="Imagen del producto"
                  src={product.images[0]}
                  width={64}
                  height={64}
                  className="rounded-md object-cover h-16 w-16"
                />
              </TableCell>
              <TableCell>{product.name}</TableCell>
              <TableCell>{product.barcode}</TableCell>
              <TableCell>{product.category.name}</TableCell>
              <TableCell>{product.compatibility.join(", ")}</TableCell>
              <TableCell>{product.brand}</TableCell>
              <TableCell>{product.location}</TableCell>
              <TableCell>{product.notes}</TableCell>
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
                    <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href={`/inventario/productos/${product.id}`}>
                        Editar
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href={`/inventario/productos/${product.id}/delete`}>
                        Eliminar
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <AddStockForm productId={product.id} productName={product.name}/>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <TransfertockForm
                        productId={product.id}
                        productName={product.name}
                        location={product.location}
                        barcode={product.barcode}
                      />
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </CardContent>
        <CardFooter>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-4">
        <Button
            variant="outline"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
        >
            Anterior
        </Button>

        <div className="flex gap-2">
            {Array.from({ length: totalPages }, (_, i) => (
            <Button
                key={i}
                variant={currentPage === i + 1 ? "default" : "outline"}
                onClick={() => setCurrentPage(i + 1)}
            >
                {i + 1}
            </Button>
            ))}
        </div>

        <Button
            variant="outline"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
        >
            Siguiente
        </Button>
        </div>
        </CardFooter>

        </Card>
    </div>
</div>

    )
}