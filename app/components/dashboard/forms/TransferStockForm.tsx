import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useEffect, useState } from "react";
import { AddStock, copyProduct, TranferStock } from "@/app/actions";
import { SubmitButton } from "../../SubmitButtons";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
        const params = new URLSearchParams();
        params.append("barcode", barcode);

        const res = await fetch(`/api/sucursales_sin_producto?${params.toString()}`);
        const data: Sucursal[] = await res.json();

        // Remove current sucursal (optional but recommended)
        const filtered = data.filter(
            (sucursal) => sucursal.name !== location
        );

        setSucursales(filtered);
        };

        fetchProducts().then(fetchSucursales);
    }, [productId, barcode]);

    return (
  <Dialog>
    <DialogTrigger asChild>
      <Button variant="outline">Traspasar / Clonar</Button>
    </DialogTrigger>

    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>{productName}</DialogTitle>
      </DialogHeader>

      <Tabs defaultValue="transfer" className="w-full mt-4">
        
        {/* ================= TAB BUTTONS ================= */}
        <TabsList className="grid grid-cols-2 w-full">
          <TabsTrigger value="transfer">Traspasar</TabsTrigger>
          <TabsTrigger value="clone">Clonar</TabsTrigger>
        </TabsList>

        {/* ================= TRANSFER TAB ================= */}
        <TabsContent value="transfer">
          {products.length > 0 ? (
            <form action={TranferStock}>
              <div className="flex flex-col gap-6 mt-4">

                <div className="flex flex-col gap-3">
                  <Label>Cantidad a Traspasar</Label>
                  <Input type="number" name="amount" required />
                </div>

                <div className="flex flex-col gap-3">
                  <Label>Sucursal destino</Label>
                  <Select name="destiny" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona sucursal" />
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
                  <Button type="button" variant="secondary">
                    Cerrar
                  </Button>
                </DialogClose>

                <SubmitButton text="Traspasar Stock" />
              </DialogFooter>
            </form>
          ) : (
            <p className="text-sm text-red-500 mt-4">
              No hay sucursales con este producto para transferir.
            </p>
          )}
        </TabsContent>

        {/* ================= CLONE TAB ================= */}
        <TabsContent value="clone">
          <form action={copyProduct}>
            <div className="flex flex-col gap-6 mt-4">

              <div className="flex flex-col gap-3">
                <Label>Crear copia en sucursal</Label>

                <Select name="sucursalId" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona sucursal" />
                  </SelectTrigger>
                  <SelectContent>
                    {sucursales.map((sucursal) => (
                      <SelectItem key={sucursal.name} value={sucursal.name}>
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
                <Button type="button" variant="secondary">
                  Cerrar
                </Button>
              </DialogClose>

              <SubmitButton text="Clonar Producto" />
            </DialogFooter>
          </form>
        </TabsContent>

      </Tabs>
    </DialogContent>
  </Dialog>
)
}