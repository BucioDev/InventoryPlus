import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useEffect } from "react";
import { SubmitButton } from "../SubmitButtons";
import { AddStock } from "@/app/actions";



export default function AddStockForm({productId, productName}:{productId:string, productName:string}){



    return(
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline">Agregar Mas Stock</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
                <DialogTitle>Agregar mas Stock a {productName}</DialogTitle>
            </DialogHeader>

            <form action={AddStock}>
                <div className="flex flex-col gap-6">
                    <div className="flex flex-col gap-3">
                        <Label>Cantidad a Agregar</Label>
                        <p className="text-sm">Esta cantida se sumara a la cantidad actual en Stock</p>
                        <Input type="number" name="amount" id="amount" placeholder="10"/>
                    </div>
                        <input type="hidden" name="id" id="id" value={productId}/>
                </div>
                <DialogFooter className="flex justify-between mt-5 ">
                <DialogClose asChild>
                    <Button type="button" variant="secondary">
                        Cerrar
                    </Button>
                </DialogClose>
                 <SubmitButton text="Agregar Stock"/>
                </DialogFooter>
               
            </form>
            </DialogContent>
        </Dialog>
    )

}