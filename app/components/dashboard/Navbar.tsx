
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import LogoutForm from "../logoutForm";
import NavbarLinks from "./NavbarLinks";
import { Button } from "@/components/ui/button";
import { MenuIcon } from "lucide-react";
import { useState } from "react";
import UserDropDown from "../UserDropDown";



export default function Navbar() {
    const [open, setOpen] = useState(false)

    return (
        <div className="w-full max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex items-center justify-between bg-black text-white rounded-b-lg">
            <div className="hidden md:flex md:items-center">
                    <NavbarLinks />
                    
            </div>
            <div className="flex items-center justify-between w-full md:hidden">
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
            </div>
            <div>
                <LogoutForm />
            </div>
        </div>
    )
}