"use client"
import React, { ReactNode, Suspense } from "react"
import Navbar from "../components/dashboard/Navbar"
import { usePathname } from "next/navigation"
import { Toaster } from "@/components/ui/sonner";
import { ToastHandler } from "../components/ToastHandler";

export default function DashboardLayout({children}:{children:ReactNode}){

    const location = usePathname();
    const hideNavbarRoutes =["/login"];

    const shouldHideNavbar = hideNavbarRoutes.includes(location);
    return(
        <>
        {!shouldHideNavbar && <Navbar />}
        <Toaster richColors  position="top-center" />
        <Suspense>
        <ToastHandler />
        </Suspense>
            <main className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 mb-5">{children}</main>
        </>
    )
}