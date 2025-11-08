// components/Receipt.tsx (client)
"use client";
import React, { forwardRef } from "react";

type OrderItem = {
  quantity?: number | null;
  priceAtSale?: number | null;
  product?: { id?: string; name?: string | null; sellprice?: number | null } | null;
};

type Order = {
  id: string;
  nickname?: string | null;
  paymentmethod?: string | null;
  status?: string | null;
  sellDate?: string | Date;
  total: number;
  items: OrderItem[];
};

interface ReceiptProps {
  order: Order;
}

const Receipt = forwardRef<HTMLDivElement, ReceiptProps>(({ order }, ref) => {
  const total = order.items.reduce((sum, item) => {
    const qty = item.quantity ?? 0;
    const price = item.priceAtSale ?? item.product?.sellprice ?? 0;
    return sum + price * qty;
  }, 0);

  return (
    <div ref={ref} className="printable bg-white text-black">

      <h1 className="text-center font-bold text-lg">Moto Refacciones Pinos 32</h1>
      <p className="text-center text-sm mb-2">Grasias por su compra</p>

      <hr className="my-2" />
      <p>Order ID: {order.id}</p>
      {order.nickname && <p>Cliente: {order.nickname}</p>}
      {order.paymentmethod && <p>Payment: {order.paymentmethod}</p>}
      {order.sellDate && <p>Fecha: {new Date(order.sellDate).toLocaleString()}</p>}
      <hr className="my-2" />

     <div className="mt-2 text-sm font-mono w-full" style={{ fontFamily: '"Courier New", monospace', whiteSpace: 'pre' }}>
        {order.items.map((item, i) => {
            const name = item.product?.name ?? "Unknown Product";
            const price = item.priceAtSale ?? item.product?.sellprice ?? 0;
            const qty = item.quantity ?? 0;
            const subtotal = price * qty;

            // Create fixed-width spacing for columns
            const formattedLine =
            name.padEnd(22, "\u00A0") +   // was 24, reduced a bit
            qty.toString().padStart(4, "\u00A0") +
            ("$" + subtotal.toFixed(2)).padStart(10, "\u00A0");


            return <div key={i}>{formattedLine}</div>;
        })}
        </div>


      <hr className="my-2" />
      <p className="text-right font-bold text-lg">Total: ${total.toFixed(2)}</p>
    </div>
  );
});

Receipt.displayName = "Receipt";
export default Receipt;
