"use client"
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { MenuIcon } from "lucide-react";
import NavbarLinks from "./NavbarLinks";
import { useState } from "react";

export default function MobileNavBar() {
    
    const [open, setOpen] = useState(false)
    return(
        <>
            <Sheet open={open} onOpenChange={setOpen}>
                    <SheetTrigger asChild>
                        <Button className="shrink-0 md:hidden"  size="icon">
                            <MenuIcon className="h-6 w-6" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left">
                        <SheetHeader>
                            <SheetTitle>
                                ControlPlus
                            </SheetTitle>
                        </SheetHeader>
                        <div className="grid gap-4 text-lg font-medium mt-10 ml-3">
                            <NavbarLinks onLinkClick={() => setOpen(false)} />
                        </div>
                    </SheetContent>
                </Sheet>
        </>
    )
}
