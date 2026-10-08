"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ShiftCheck() {
    const router = useRouter();

    useEffect(() => {
        async function checkShift() {
            const response = await fetch("/api/shift/check", {
                method: "POST"
            });
    
            console.log("status:", response.status);
            console.log("status text:", response.statusText);
    
            const text = await response.text();
            console.log("response:", text);
    
            if (!response.ok) {
                console.error("Error checking shift");
                return;
            }
    
            const data = JSON.parse(text);
    
            if (data.redirect) {
                router.replace(data.redirect);
            }
        }
    
        checkShift();
    }, [router]);

    return null;
}