// app/api/orders-by-month/route.ts
import prisma from "@/app/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const orders = await prisma.order.findMany({
    where: { status: "completada" },
    select: { total: true, orderPrice: true, sellDate: true },
  });

  // Map keyed by YYYY-MM for sorting
  const monthly = new Map<
    string,
    { monthLabel: string; total: number; orderPrice: number; sortKey: string }
  >();

  for (const o of orders) {
    if (!o.sellDate) continue;
    const d = new Date(o.sellDate);
    const year = d.getFullYear();
    const monthIndex = d.getMonth(); // 0-11
    const sortKey = `${year}-${String(monthIndex + 1).padStart(2, "0")}`; // e.g. "2025-03"
    const monthLabel = d.toLocaleString("default", { month: "short", year: "numeric" }); // e.g. "Mar 2025"

    const current = monthly.get(sortKey) ?? { monthLabel, total: 0, orderPrice: 0, sortKey };
    current.total += Number(o.total ?? 0);
    current.orderPrice += Number(o.orderPrice ?? 0);
    monthly.set(sortKey, current);
  }

  const data = Array.from(monthly.values())
    .sort((a, b) => a.sortKey.localeCompare(b.sortKey))
    .map((m) => ({ month: m.monthLabel, total: m.total, orderPrice: m.orderPrice }));

  return NextResponse.json(data);
}
