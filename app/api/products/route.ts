import prisma from "@/app/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const barcode = searchParams.get("barcode") || "";
  const location = searchParams.get("location") || "";
  const compatibility = searchParams.getAll("compatibility");
  const name = searchParams.get("name") || "";

  try {
    // 1️⃣ Fetch all products that match other filters first
    const products = await prisma.product.findMany({
      select: {
        id: true,
        name: true,
        barcode: true,
        categoryId: true,
        compatibility: true,
        brand: true,
        location: true,
        notes: true,
        images: true,
        variant: true,
        stock: true,
        sellprice: true,
        buyprice: true,
        category: {
          select: {
            name: true,
          },
        },
      },
      where: {
        AND: [
          barcode ? { barcode: { contains: barcode, mode: "insensitive" } } : {},
          name ? { name: { contains: name, mode: "insensitive" } } : {},
          location ? { location: { contains: location, mode: "insensitive" } } : {},
        ],
      },
    });

    // 2️⃣ Apply case-insensitive filtering for compatibility manually
    let filteredProducts = products;
    if (compatibility.length > 0) {
      const loweredFilters = compatibility.map((c) => c.toLowerCase());
      filteredProducts = products.filter((p) =>
        Array.isArray(p.compatibility) &&
        p.compatibility.some((comp) =>
          loweredFilters.some((f) => comp.toLowerCase().includes(f))
        )
      );
    }

    // 3️⃣ Return the filtered results
    return NextResponse.json(filteredProducts);
  } catch (err) {
    console.error("Error fetching products:", err);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
