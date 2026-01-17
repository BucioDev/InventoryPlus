"use client";

import { useEffect, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { useRouter } from "next/navigation";
import Receipt from "./Receipt";

export default function AutoPrintReceipt({ order, username }: { order: any, username: string }) {
  const router = useRouter();
  const receiptRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef: receiptRef,
    documentTitle: `Order-${order.id}`,
  });

  useEffect(() => {
    if (!order) return;

    // 🖨️ Print the receipt first
    handlePrint?.();

    // ⏳ After 2.5 seconds, redirect to orders page
    const timer = setTimeout(() => {
      router.push("/ordenes");
    }, 500);

    // 🧹 Cleanup if component unmounts early
    return () => clearTimeout(timer);
  }, [order, handlePrint, router]);

  return (
    <div className="p-4">
      <Receipt ref={receiptRef} order={order} username={username}/>
    </div>
  );
}
