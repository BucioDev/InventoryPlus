import prisma from "@/app/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const selectedLocation = searchParams.get("location") || "all";

    // =========================
    // 🔍 BASE FILTER
    // =========================

    const where: any = {
      isDeleted: false,
    };

    // If a specific location was selected,
    // filter only products from that location.
    if (selectedLocation !== "all") {
      where.location = selectedLocation;
    }

    // =========================
    // 📦 GET PRODUCTS
    // =========================

    const products = await prisma.product.findMany({
      where,
      select: {
        id: true,
        barcode: true,
        name: true,
        stock: true,
        alertammount: true,
        notes:true,
        location: true,
      },
      orderBy: [
        {
          location: "asc",
        },
        {
          name: "asc",
        },
      ],
    });

    // =========================
    // 📍 GROUP BY LOCATION
    // =========================

    const locationMap: Record<
      string,
      {
        outOfStock: typeof products;
        lowStock: typeof products;
      }
    > = {};

    products.forEach((product) => {
      const location = product.location || "Sin sucursal";

      if (!locationMap[location]) {
        locationMap[location] = {
          outOfStock: [],
          lowStock: [],
        };
      }

      // =========================
      // 🔴 OUT OF STOCK
      // =========================

      if (product.stock === 0) {
        locationMap[location].outOfStock.push(product);
      }

      // =========================
      // 🟡 LOW STOCK
      // =========================

      if (
        product.stock > 0 &&
        product.stock <= product.alertammount
      ) {
        locationMap[location].lowStock.push(product);
      }
    });

    // =========================
    // 📊 FORMAT RESPONSE
    // =========================

    const locations = Object.entries(locationMap).map(
      ([location, data]) => ({
        location,
        outOfStock: data.outOfStock,
        lowStock: data.lowStock,
      })
    );

    return NextResponse.json({
      location: selectedLocation,
      locations,
    });
  } catch (error) {
    console.error(
      "Error generating inventory report:",
      error
    );

    return NextResponse.json(
      {
        error: "Error al generar el reporte de inventario",
      },
      {
        status: 500,
      }
    );
  }
}