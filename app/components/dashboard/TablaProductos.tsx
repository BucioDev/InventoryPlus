"use client"
import AddStockForm from "@/app/components/dashboard/forms/AddStockForm";
import TransfertockForm from "@/app/components/dashboard/forms/TransferStockForm";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ChevronRight, MoreHorizontal, PlusCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import ImageWithZoom from "../imageWithZoom";

interface tabalProductosProps {
    role:string;
    local:string;
}

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

export default function TablaProductos({role, local}:tabalProductosProps) {

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
    
    useEffect(() => {
      setCurrentPage(1);
    }, [products]);
    
    // Apply debounce to barcode and location
    const debouncedBarcode = useDebounce(barcode, 500);   // waits .5s after typing
    const debounceName = useDebounce(name, 500)
    const debouncedLocation = useDebounce(location, 500); 

    // Fetch products whenever filters change
    useEffect(() => {
        const fetchProducts = async () => {
            const params = new URLSearchParams();
          
            if (debouncedBarcode) params.append("barcode", debouncedBarcode);
            if (debounceName) params.append("name", debounceName);
          
            if (role === "vendor") {
              params.append("location", local);
              setLocation(local)
            } else if (debouncedLocation) {
              params.append("location", debouncedLocation);
            }
          
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

    const getPaginationPages = (): (number | "...")[] => {
        const pages: (number | "...")[] = [];
      
        if (totalPages <= 7) {
          return Array.from({ length: totalPages }, (_, i) => i + 1);
        }
      
        // Near the beginning
        if (currentPage <= 4) {
          pages.push(1, 2, 3, 4, 5, "...");
          pages.push(totalPages);
          return pages;
        }
      
        // Near the end
        if (currentPage >= totalPages - 3) {
          pages.push(1, "...");
          pages.push(
            totalPages - 4,
            totalPages - 3,
            totalPages - 2,
            totalPages - 1,
            totalPages
          );
          return pages;
        }
      
        // Somewhere in the middle
        pages.push(1, "...");
        pages.push(
          currentPage - 2,
          currentPage - 1,
          currentPage,
          currentPage + 1,
          currentPage + 2
        );
        pages.push("...", totalPages);
      
        return pages;
      };

      return (
        <div className="w-full max-w-screen-2xl mx-auto grid gap-4 mt-5">
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Acciones</CardTitle>
            </CardHeader>
      
            <CardContent className="flex justify-between">
              <Button asChild>
                <Link href="/inventario/productos/create"><PlusCircle /> Agregar producto</Link>
              </Button>
      
              <Button asChild>
                <Link href="/inventario/categorias">Ver categorias <ChevronRight /></Link>
              </Button>
            </CardContent>
          </Card>
      
          <Card className="w-full">
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
                    disabled={role === "vendor"}
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
      
            <CardContent className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Image</TableHead>
                    <TableHead className="max-w-[200px]">Nombre</TableHead>
                    <TableHead>Codigo de barras</TableHead>
                    <TableHead>Categoria</TableHead>
                    <TableHead className="max-w-[200px]">Compatibilidad</TableHead>
                    <TableHead>Marca</TableHead>
                    <TableHead>Ubicacion</TableHead>
                    <TableHead>Notas</TableHead>
                    <TableHead>Variante</TableHead>
                    <TableHead>Stock</TableHead>
      
                    {role !== "vendor" && (
                      <TableHead>Precio de compra</TableHead>
                    )}
      
                    <TableHead>Precio de venta</TableHead>
      
                    {role !== "vendor" && (
                      <TableHead>Acciones</TableHead>
                    )}
                  </TableRow>
                </TableHeader>
      
                <TableBody>
                  {paginatedProducts.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>
                        <ImageWithZoom image={product.images[0]}/>
                      </TableCell>
      
                      <TableCell className="max-w-[200px] whitespace-normal break-words">
                        {product.name}
                      </TableCell>
      
                      <TableCell>{product.barcode}</TableCell>
      
                      <TableCell>{product.category.name}</TableCell>
      
                      <TableCell className="max-w-[200px] whitespace-normal break-words">
                        {product.compatibility.join(", ")}
                      </TableCell>
      
                      <TableCell>{product.brand}</TableCell>
      
                      <TableCell>{product.location}</TableCell>
      
                      <TableCell className="max-w-[200px] whitespace-normal break-words">
                        {product.notes}
                      </TableCell>
      
                      <TableCell>{product.variant}</TableCell>
      
                      <TableCell>{product.stock}</TableCell>
      
                      {role !== "vendor" && (
                        <TableCell>{product.buyprice}</TableCell>
                      )}
      
                      <TableCell>{product.sellprice}</TableCell>
      
                      {role !== "vendor" && (
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
                                <AddStockForm
                                  productId={product.id}
                                  productName={product.name}
                                />
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
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
      
            <CardFooter>
              <div className="flex items-center w-full justify-between mt-4">
                <Button
                  variant="outline"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(currentPage - 1)}
                >
                  Anterior
                </Button>
      
                <div className="flex gap-2">
                  {getPaginationPages().map((page, i) =>
                    page === "..." ? (
                      <span
                        key={`ellipsis-${i}`}
                        className="flex items-center px-2"
                      >
                        ...
                      </span>
                    ) : (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        onClick={() => setCurrentPage(page as number)}
                      >
                        {page}
                      </Button>
                    )
                  )}
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
      );
}



