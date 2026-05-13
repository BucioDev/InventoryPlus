import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";


export default function SearchForClientModal(){

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant={"outline"}>Buscar Cliente</Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Buscar al cliente por nombre</DialogTitle>
                </DialogHeader>
            </DialogContent>

        </Dialog>
    )
}