"use client";

import { Input } from "@/components/ui/input";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
}

export default function OrderSearch() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const initialSearch = searchParams.get("search") || "";

    const [search, setSearch] = useState(initialSearch);

    const debouncedSearch = useDebounce(search, 400);

    useEffect(() => {
        const params = new URLSearchParams(searchParams.toString());

        if (debouncedSearch.trim()) {
            params.set("search", debouncedSearch);
        } else {
            params.delete("search");
        }

        router.push(`/ordenes?${params.toString()}`);
    }, [debouncedSearch, router, searchParams]);

    return (
        <Input
            type="text"
            placeholder="Buscar por ID o cliente..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            autoComplete="off"
            className="max-w-sm"
        />
    );
}