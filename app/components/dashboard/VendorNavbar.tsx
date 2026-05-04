"use client"

import { cn } from "@/lib/utils"
import Link from "next/link";
import { usePathname } from "next/navigation"

const links = [
    {
        id:0,
        name: "Ordenes",
        href: "/ordenes",
    },
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