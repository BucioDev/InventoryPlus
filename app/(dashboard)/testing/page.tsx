"use client"
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";

// A simple debounce hook
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // Start a timer when value changes
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Clear the timer if value changes again before delay ends
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

type Category = {
  id: string;
  name: string;
  description: string;
};

export default function ProductsPage() {
  const [barcode, setBarcode] = useState("");
  const [location, setLocation] = useState("");
  const [compatibility, setCompatibility] = useState<string[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  // Apply debounce to barcode and location
  const debouncedBarcode = useDebounce(barcode, 500);   // waits 500ms after typing
  const debouncedLocation = useDebounce(location, 500); // waits 500ms after typing

  // Fetch products whenever filters change
  useEffect(() => {
    const fetchProducts = async () => {
      const params = new URLSearchParams();
      if (debouncedBarcode) params.append("barcode", debouncedBarcode);
      if (debouncedLocation) params.append("location", debouncedLocation);
      compatibility.forEach(c => params.append("compatibility", c));

      const res = await fetch(`/api/products?${params.toString()}`);
      const data = await res.json();
      console.log("json ", data)
      setProducts(data);
    };

    const fetchCategories = async () =>{
      const res = await fetch("api/categorias");
      const data:Category[] = await res.json();
      setCategories(data);
    }
    fetchCategories().then(fetchProducts);
  }, [debouncedBarcode, debouncedLocation, compatibility]);

  // Add compatibility tag on Enter
  function handleCompatibilityAdd(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      const value = (e.target as HTMLInputElement).value.trim();
      if (value && !compatibility.includes(value)) {
        setCompatibility(prev => [...prev, value]);
      }
      (e.target as HTMLInputElement).value = "";
    }
  }

  return (
    <div className="space-y-4">
      <Input
        placeholder="Search barcode..."
        value={barcode}
        onChange={e => setBarcode(e.target.value)}
      />
      <Input
        placeholder="Search location..."
        value={location}
        onChange={e => setLocation(e.target.value)}
      />

      <Input
        placeholder="Add compatibility..."
        onKeyDown={handleCompatibilityAdd}
      />
      <div className="flex gap-2 flex-wrap">
        {compatibility.map(c => (
          <Button
            key={c}
            variant="secondary"
            onClick={() => setCompatibility(prev => prev.filter(x => x !== c))}
          >
            {c} ✕
          </Button>
        ))}
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Barcode</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Compatibility</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map(p => (
            <TableRow key={p.id}>
              <TableCell>{p.name}</TableCell>
              <TableCell>{p.barcode}</TableCell>
              <TableCell>{p.location}</TableCell>
              <TableCell>{p.compatibility.join(", ")}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
