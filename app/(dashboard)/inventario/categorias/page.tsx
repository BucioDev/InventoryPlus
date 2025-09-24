import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export default function Category() {
    return (
        <div>
            <h1>Category</h1>
            <div className="flex items-center gap-4">
            <Button asChild>
                <Link href="/inventario">
                    <ChevronLeft className="h-5 w-5 " />
                </Link>
            </Button>
            </div>
        </div>
    )
}