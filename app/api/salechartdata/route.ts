
import prisma from "@/app/lib/prisma";
import { NextResponse } from "next/server";
function monthKey(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  return `${y}-${m}`;
}

export async function GET() {
  try {
    // 1️⃣ Completed orders grouped by SELL DATE
    const orders = await prisma.order.findMany({
      where: {
        status: "completada",
        sellDate: { not: null },
      },
      select: {
        total: true,
        orderPrice: true,
        sellDate: true,
      },
    });

    const salesByMonth: Record<
      string,
      { total: number; orderPrice: number }
    > = {};

    orders.forEach((o) => {
      const month = monthKey(o.sellDate!);

      if (!salesByMonth[month]) {
        salesByMonth[month] = { total: 0, orderPrice: 0 };
      }

      salesByMonth[month].total += o.total;
      salesByMonth[month].orderPrice += o.orderPrice;
    });

    // 2️⃣ Gastos (bills) by creation date
    const gastos = await prisma.gastos.findMany({
      where: { isDeleted: false },
      select: {
        amount: true,
        createdAt: true,
      },
    });

    const gastosByMonth: Record<string, number> = {};

    gastos.forEach((g) => {
      const month = monthKey(g.createdAt);
      gastosByMonth[month] = (gastosByMonth[month] || 0) + g.amount;
    });

    // 3️⃣ Merge bills into orderPrice
    const result = Object.entries(salesByMonth)
      .map(([month, values]) => ({
        month,
        total: values.total,
        orderPrice:
          values.orderPrice + (gastosByMonth[month] ?? 0),
      }))
      .sort((a, b) => a.month.localeCompare(b.month));

    return NextResponse.json(result);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to load sales chart data" },
      { status: 500 }
    );
  }
}