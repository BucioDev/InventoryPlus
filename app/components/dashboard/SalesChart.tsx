"use client";

import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

type DataPoint = { month: string; total: number; orderPrice: number };

export default function SalesChart() {
  const [data, setData] = useState<DataPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function fetchData() {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch("/api/ordersbymonth");
        if (!res.ok) throw new Error(`Status ${res.status}`);
        const json: DataPoint[] = await res.json();
        if (mounted) setData(json);
      } catch (e: any) {
        if (mounted) setError(e.message || "Failed to fetch");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchData();

    // Optional: poll every 10s for updates
    const interval = setInterval(fetchData, 10000);

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  return (
    <Card className="w-full h-[420px]">
      <CardHeader>
        <CardTitle>Ventas vs Costos por mes</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div>Loading...</div>
        ) : error ? (
          <div className="text-red-500">Error: {error}</div>
        ) : data.length === 0 ? (
          <div>No hay datos</div>
        ) : (
          <ResponsiveContainer width="100%" height={360}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="total" name="Ventas (Total)" fill="#3b82f6" />
                <Bar dataKey="orderPrice" name="Costos (Compra)" fill="#ef4444" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
