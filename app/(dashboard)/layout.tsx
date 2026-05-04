
import React, { ReactNode, Suspense } from "react"
import { Toaster } from "@/components/ui/sonner";
import { ToastHandler } from "../components/ToastHandler";
import Navbar from "../components/dashboard/Navbar";
import NavbarClient from "../components/dashboard/NavBarClient";

export default function DashboardLayout({children}:{children:ReactNode}){

    return(
        <>
        <NavbarClient />
        <Toaster richColors  position="top-center" />
        <Suspense>
        <ToastHandler />
        </Suspense>
            <main className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 mb-5">{children}</main>
        </>
    )
}