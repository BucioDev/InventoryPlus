import prisma from "@/app/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const barcode = searchParams.get("barcode") || "";

  try {
    // 1️⃣ Fetch all products that match other filters first
    const products = await prisma.product.findMany({
      select: {
        id: true,
        name: true,
        barcode: true,
        location: true,
      },
      where: {
        barcode:barcode
      },
    });

 

    // 3️⃣ Return the filtered results
    return NextResponse.json(products);
  } catch (err) {
    console.error("Error fetching products:", err);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
