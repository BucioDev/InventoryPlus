import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useEffect, useState } from "react";
import { AddStock, copyProduct, TranferStock } from "@/app/actions";
import { SubmitButton } from "../../SubmitButtons";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type Products = {
    id:string;
    name:string;
    barcode:string;
    location:string;
}

type Sucursal = {
    id: string;
    name: string;
  };

export default function TransfertockForm({productId, productName, location, barcode}:{productId:string, productName:string, location:string, barcode:string}){

    const [products, setProducts] = useState<Products[]>([]);

    const [sucursales, setSucursales] = useState<Sucursal[]>([]);

    useEffect(() => {
        const fetchProducts = async () => {
        const params = new URLSearchParams();
        params.append("barcode", barcode);
        const res = await fetch(`/api/productsbybarcode?${params.toString()}`);
        const data: Products[] = await res.json();

        const filteredProducts = data.filter((product) => product.id !== productId);

        setProducts(filteredProducts);
        };

        const fetchSucursales = async () => {
            const res = await fetch("/api/sucursales");
            const data: Sucursal[] = await res.json();
            const filterSucursales = data.filter((sucursal) => sucursal.name !== location)
            setSucursales(filterSucursales)
            
        };

        fetchProducts().then(fetchSucursales);
    }, [productId, barcode]);

    return(
        <Dialog>  
            <DialogTrigger asChild>
                <Button variant="outline">Traspasar Stock </Button>
            </DialogTrigger>
           <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Traspasar Stock de {productName}</DialogTitle>
                </DialogHeader>

                {products.length > 0 ? (
                    /* ============================================================
                    CASE 1: Product exists in another branch → Transfer Stock
                    ============================================================ */
                    <form action={TranferStock}>
                    <div className="flex flex-col gap-6">

                        <div className="flex flex-col gap-3">
                        <Label>Cantidad a Traspasar</Label>
                        <p className="text-sm">Esta cantidad se restará del stock actual.</p>
                        <p className="text-sm">Y se sumará a la sucursal seleccionada.</p>
                        <Input type="number" name="amount" placeholder="10" required />
                        </div>

                        <div className="flex flex-col gap-3">
                        <Label>Selecciona la Sucursal donde se enviará el Stock</Label>

                        <Select name="destiny" required>
                            <SelectTrigger>
                            <SelectValue placeholder="Selecciona la Sucursal Destino" />
                            </SelectTrigger>
                            <SelectContent>
                            {products.map((product) => (
                                <SelectItem key={product.id} value={product.id}>
                                {product.location}
                                </SelectItem>
                            ))}
                            </SelectContent>
                        </Select>
                        </div>

                        <input type="hidden" name="id" value={productId} />
                    </div>

                    <DialogFooter className="flex justify-between mt-5">
                        <DialogClose asChild>
                        <Button type="button" variant="secondary">Cerrar</Button>
                        </DialogClose>

                        <SubmitButton text="Traspasar Stock" />
                    </DialogFooter>
                    </form>

                ) : (
                    /* ============================================================
                    CASE 2: Product does NOT exist → Create Copy Form
                    ============================================================ */
                    <form action={copyProduct}> {/* You will set this action later */}
                    <div className="flex flex-col gap-6">

                        <p className="text-sm text-red-500 italic">
                        El producto equivalente no ha sido encontrado en otra sucursal.
                        Favor de registrarlo primero.
                        </p>

                        <div className="flex flex-col gap-3">
                        <Label>Lugar donde Crear Copia del producto</Label>

                        <Select name="sucursalId" required>
                            <SelectTrigger>
                            <SelectValue placeholder="Selecciona una Sucursal" />
                            </SelectTrigger>
                            <SelectContent>
                            {sucursales.map((sucursal) => (
                                <SelectItem key={sucursal.id} value={sucursal.name}>
                                {sucursal.name}
                                </SelectItem>
                            ))}
                            </SelectContent>
                        </Select>
                        </div>

                        <input type="hidden" name="productId" value={productId} />

                    </div>

                    <DialogFooter className="flex justify-between mt-5">
                        <DialogClose asChild>
                        <Button type="button" variant="secondary">Cerrar</Button>
                        </DialogClose>

                        <SubmitButton text="Crear Copia del Producto" />
                    </DialogFooter>
                    </form>
                )}

                </DialogContent>

        </Dialog>
    )

}