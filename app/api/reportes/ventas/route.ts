import prisma from "@/app/lib/prisma";
import { NextResponse } from "next/server";
import { Status } from "@/lib/generated/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const type = searchParams.get("type") || "all";
  const selectedUser = searchParams.get("user") || "all";
  const selectedLocation = searchParams.get("location") || "all";
  const groupByTime = searchParams.get("groupByTime") || "day"; // day | hour

  const startDateParam = searchParams.get("startDate");
  const endDateParam = searchParams.get("endDate");

  let start: Date | undefined;
  let end: Date | undefined;

  // ✅ Normalize date range (FULL DAY)
  if (startDateParam && endDateParam) {
    start = new Date(startDateParam);
    start.setHours(0, 0, 0, 0);

    end = new Date(endDateParam);
    end.setHours(23, 59, 59, 999);
  }

  // 🔍 Base filters
  const where: any = {
    status: Status.completada,
    ...(start && end
      ? { sellDate: { gte: start, lte: end } }
      : {}),
  };

  // ✅ Independent filters
  if (selectedUser !== "all") {
    where.userID = selectedUser;
  }

  if (selectedLocation !== "all") {
    where.location = selectedLocation;
  }

  const reports: any = {};

  // =========================
  // 📊 SUMMARY
  // =========================
  if (type === "summary" || type === "all") {
    const summary = await prisma.order.aggregate({
      _sum: { total: true, orderPrice: true },
      _count: { id: true },
      where,
    });

    const expenses = await prisma.gastos.aggregate({
      _sum: { amount: true },
      where: {
        ...(start && end
          ? { createdAt: { gte: start, lte: end } }
          : {}),
      },
    });

    const totalSales = summary._sum.total ?? 0;
    const totalCost = summary._sum.orderPrice ?? 0;
    const totalExpenses = expenses._sum.amount ?? 0;

    reports.summary = {
      totalOrders: summary._count.id,
      totalSales,
      totalCost,
      profit: totalSales - totalCost,
      totalExpenses,
      netProfit: totalSales - totalCost - totalExpenses,
    };
  }

  // =========================
  // 💰 PROFIT BY LOCATION
  // =========================
  if (type === "profit" || type === "all") {
    const profit = await prisma.order.groupBy({
      by: ["location"],
      _sum: { total: true, orderPrice: true },
      where,
    });

    reports.profit = profit.map((r) => {
      const totalSales = r._sum.total ?? 0;
      const totalCost = r._sum.orderPrice ?? 0;

      return {
        location: r.location ?? "Sin ubicación",
        totalSales,
        totalCost,
        profit: totalSales - totalCost,
      };
    });
  }

  // =========================
  // 📍 SALES BY LOCATION
  // =========================
  if (type === "byLocation" || type === "all") {
    const orders = await prisma.order.findMany({
      where,
      select: {
        id: true,
        location: true,
        total: true,
        sellDate: true,
      },
      orderBy: {
        sellDate: "desc",
      },
    });
  
    const locationMap: Record<string, any> = {};
  
    orders.forEach((order) => {
      const location = order.location ?? "Sin ubicación";
  
      if (!locationMap[location]) {
        locationMap[location] = {
          totalSales: 0,
          orders: 0,
          breakdown: [],
        };
      }
  
      locationMap[location].totalSales += order.total;
      locationMap[location].orders += 1;
  
      locationMap[location].breakdown.push({
        id: order.id,
        date: order.sellDate,
        total: order.total,
      });
    });
  
    reports.byLocation = Object.entries(locationMap).map(
      ([location, data]: any) => ({
        location,
        totalSales: data.totalSales,
        orders: data.orders,
        breakdown: data.breakdown,
      })
    );
  }

  // =========================
  // 👤 SALES BY USER
  // =========================
  if (type === "byUser" || type === "all") {
    const orders = await prisma.order.findMany({
      where,
      select: {
        id: true,
        userID: true,
        total: true,
        sellDate: true,
      },
      orderBy: {
        sellDate: "desc",
      },
    });
  
    const userMap: Record<string, any> = {};
  
    orders.forEach((order) => {
      const userID = order.userID;
  
      if (!userMap[userID]) {
        userMap[userID] = {
          totalSales: 0,
          orders: 0,
          breakdown: [],
        };
      }
  
      userMap[userID].totalSales += order.total;
      userMap[userID].orders += 1;
  
      userMap[userID].breakdown.push({
        id: order.id,
        date: order.sellDate,
        total: order.total,
      });
    });
  
    const userIds = Object.keys(userMap);
  
    const users = await prisma.user.findMany({
      where: { id: { in: userIds } },
      select: { id: true, firstName: true, lastName: true },
    });
  
    const userNameMap = new Map(
      users.map((u) => [u.id, `${u.firstName} ${u.lastName ?? ""}`])
    );
  
    reports.byUser = Object.entries(userMap).map(
      ([userID, data]: any) => ({
        user: userNameMap.get(userID) ?? userID,
        totalSales: data.totalSales,
        orders: data.orders,
        breakdown: data.breakdown,
      })
    );
  }

  // =========================
  // 📈 SALES OVER TIME
  // =========================
  if (type === "timeSeries" || type === "all") {
    const orders = await prisma.order.findMany({
      where,
      select: {
        sellDate: true,
        total: true,
      },
    });

    const salesMap: Record<string, number> = {};

    orders.forEach((order) => {
      if (!order.sellDate) return;

      let key: string;

      if (groupByTime === "hour") {
        key = order.sellDate.toISOString().slice(0, 13); // hourly
      } else {
        key = order.sellDate.toISOString().split("T")[0]; // daily
      }

      salesMap[key] = (salesMap[key] || 0) + order.total;
    });

    reports.timeSeries = Object.entries(salesMap).map(
      ([date, total]) => ({
        date,
        total,
      })
    );
  }

  return NextResponse.json(reports);
}