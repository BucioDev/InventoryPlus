import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useEffect, useState } from "react";
import { AddStock, TranferStock } from "@/app/actions";
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
            setSucursales(data)
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

            <form action={TranferStock}>
                <div className="flex flex-col gap-6">
                    <div className="flex flex-col gap-3">
                        <Label>Cantidad a Trasnpasar</Label>
                        <p className="text-sm">Esta cantida se restara a la cantidad actual en Stock de esta sucursal</p>
                        <p className="text-sm">y se Sumara a la Surcursal seleccionada</p>
                        <Input type="number" name="amount" id="amount" placeholder="10" required/>
                    </div>
                   <div className="flex flex-col gap-3">
                    <Label>Selecciona la Sucursal donde se enviará el Stock</Label>

                    {products.length > 0 ? (
                        <Select key="destiny" name="destiny" required>
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
                    ) : (
                        <div className="flex flex-col gap-3">
                            <p className="text-sm text-red-500 italic">
                        El producto equivalente no  ha sido encontrado en otra sucursal. Favor de registrarlo primero
                        </p>
                        
                        </div>
                        
                        
                    )}
                    </div>
                        <input type="hidden" name="id" id="id" value={productId}/>
                </div>
                <DialogFooter className="flex justify-between mt-5 ">
                <DialogClose asChild>
                    <Button type="button" variant="secondary">
                        Cerrar
                    </Button>
                </DialogClose>
                 <SubmitButton text="Traspasar Stock"/>
                </DialogFooter>
               
            </form>
            </DialogContent>
        </Dialog>
    )

}