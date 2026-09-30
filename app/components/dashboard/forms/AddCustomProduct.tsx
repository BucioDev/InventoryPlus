import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

interface AddCustomProductFormProps {
    onAdd: (item: {
        description: string;
        quantity: number;
        priceAtSale: number;
    }) => void;
}

export default function AddCustomProductForm({ onAdd }: AddCustomProductFormProps) {
    const [description, setDescription] = useState("");
    const [priceAtSale, setPriceAtSale] = useState("");
    const [quantity, setQuantity] = useState("1");

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="default">Agregar Producto o Servicio no registrado</Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Agregar la informacion del Producto o Servicio no registrado en sistema</DialogTitle>
                </DialogHeader>

                <div className="flex flex-col gap-6 mt-4">
                    <div className="flex flex-col gap-3">
                        <Label>Nombre / Descripcion del producto o servicio</Label>
                        <Input
                            type="text"
                            name="description"
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                        />
                    </div>

                    <div className="flex flex-col gap-3">
                        <Label>Precio del producto o servicio</Label>
                        <Input
                            type="number"
                            name="precio"
                            value={priceAtSale}
                            onChange={e => setPriceAtSale(e.target.value)}
                        />
                    </div>

                    <div className="flex flex-col gap-3">
                        <Label>Cantidad de productos o servicios</Label>
                        <Input
                            type="number"
                            name="cantidad"
                            value={quantity}
                            onChange={e => setQuantity(e.target.value)}
                        />
                    </div>
                </div>

                <DialogFooter className="flex justify-between mt-5">
                    <DialogClose asChild>
                        <Button type="button" variant="secondary">
                            Cerrar
                        </Button>
                    </DialogClose>
                    <DialogClose asChild>
                    <Button
                        type="button"
                        onClick={() => {
                            onAdd({
                                description,
                                quantity: Number(quantity),
                                priceAtSale: Number(priceAtSale),
                            });
                        }}
                    >
                        Agregar Producto o Servicio a Orden
                    </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}