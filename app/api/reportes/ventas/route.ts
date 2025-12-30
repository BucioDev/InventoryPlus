
import prisma from "@/app/lib/prisma";
import { NextResponse } from "next/server";
import { Status } from "@/lib/generated/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const type = searchParams.get("type") || "all";
  const selectedUser = searchParams.get("user") || "all";
  const selectedLocation = searchParams.get("location") || "all";

  const startDate = searchParams.get("startDate")
    ? new Date(searchParams.get("startDate")!)
    : undefined;

  const endDate = searchParams.get("endDate")
    ? new Date(searchParams.get("endDate")!)
    : undefined;

  // 🔍 Base filters
  const where: any = {
    status: Status.completada,
    ...(startDate && endDate
      ? { sellDate: { gte: startDate, lte: endDate } }
      : {}),
  };

  // 🔍 Add user filter only when type = byUser
  if (type === "byUser" && selectedUser !== "all") {
    where.userID = selectedUser;
  }

  // 🔍 Add location filter only when type = byLocation
  if (type === "byLocation" && selectedLocation !== "all") {
    where.location = selectedLocation;
  }

  const reports: any = {};

  // PROFIT REPORT
  if (type === "profit" || type === "all") {
    const profit = await prisma.order.groupBy({
      by: ["location"],
      _sum: { total: true, orderPrice: true },
      where,
    });

    reports.profit = profit.map((r) => ({
      location: r.location ?? "Sin ubicación",
      totalSales: r._sum.total ?? 0,
      totalCost: r._sum.orderPrice ?? 0,
      profit: (r._sum.total ?? 0) - (r._sum.orderPrice ?? 0),
    }));
  }

  // SALES BY LOCATION
  if (type === "byLocation" || type === "all") {
    const salesByLocation = await prisma.order.groupBy({
      by: ["location"],
      _count: { id: true },
      _sum: { total: true },
      where,
    });

    reports.byLocation = salesByLocation.map((r) => ({
      location: r.location ?? "Sin ubicación",
      orders: r._count.id,
      totalSales: r._sum.total ?? 0,
    }));
  }

  // SALES BY USER
  if (type === "byUser" || type === "all") {
    const salesByUser = await prisma.order.groupBy({
      by: ["userID"],
      _count: { id: true },
      _sum: { total: true },
      where,
    });

    const userIds = salesByUser.map((s) => s.userID);
    const users = await prisma.user.findMany({
      where: { id: { in: userIds } },
      select: { id: true, firstName: true, lastName: true },
    });

    reports.byUser = salesByUser.map((s) => {
      const user = users.find((u) => u.id === s.userID);
      return {
        user: user ? `${user.firstName} ${user.lastName}` : s.userID,
        orders: s._count.id,
        totalSales: s._sum.total ?? 0,
      };
    });
  }

  return NextResponse.json(reports);
}
