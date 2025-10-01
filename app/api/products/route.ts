
import prisma from "@/app/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const barcode = searchParams.get("barcode") || "";
  const location = searchParams.get("location") || "";
  const compatibility = searchParams.getAll("compatibility");

  try {
    const products = await prisma.product.findMany({
      select:{
        id:true,
        name:true,
        barcode:true,
        categoryId:true,
        compatibility:true,
        brand:true,
        location:true,
        variant:true,
        stock:true,
        sellprice:true,
        buyprice:true,
        category:{
            select:{
                name:true,
            }
        }
    },
      where: {
        AND: [
          barcode ? { barcode: { contains: barcode, mode: "insensitive" } } : {},
          location ? { location: { contains: location, mode: "insensitive" } } : {},
          compatibility.length
            ? { compatibility: { hasSome: compatibility.map(c => c.toLowerCase()) } }
            : {},
        ],
      },
    });

    return NextResponse.json(products);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}
