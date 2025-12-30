"use client"

import { cn } from "@/lib/utils"
import Link from "next/link";
import { usePathname } from "next/navigation"

const links = [
    {
        id:0,
        name:"Dashboard",
        href:"/",
    },
    {
        id:1,
        name: "Inventario",
        href: "/inventario",
    },
    {
        id:2,
        name: "Ordenes",
        href: "/ordenes",
    },
    {
        id:3,
        name:"Usuarios",
        href: "/usuarios",
    },
    {
        id:4,
        name:"Proveedores",
        href: "/proveedores",
    },
    {
        id:5,
        name:"Sucursales",
        href: "/sucursales",
    },
    {
        id:6,
        name:"Ajustes",
        href: "/ajustes",
    }
]

export default function NavbarLinks({onLinkClick}:{onLinkClick?:() => void}) {
    const pathname = usePathname();
    return(
        <>
            {links.map((link) => (
                <Link key={link.id} 
                href={link.href}
                onClick={onLinkClick} 
                className={cn(link.href === pathname ? 'bg-gray-200 text-black': 'hover:bg-gray-200/50 ',
                "group p-2 font-semibold rounded-md")}>
                    {link.name}</Link>
            ))}
        </>
    )
}