import prisma from "@/app/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const barcode = searchParams.get("barcode") || "";

  const sucursalesWithProduct = await prisma.product.findMany({
    select: {
      location: true,
    },
    where: {
      barcode: barcode,
    },
  });

  const sucursales = await prisma.sucursales.findMany({
    select: {
      id: true,
      name: true,
    },
    where: {
      isDeleted: false,
    },
  });

  // 👇 Step 1: get array of locations
  const locationsWithProduct = sucursalesWithProduct.map(
    (p) => p.location
  );

  // 👇 Step 2: filter
  const filteredSucursales = sucursales.filter(
    (sucursal) => !locationsWithProduct.includes(sucursal.name)
  );

  return NextResponse.json(filteredSucursales);
}