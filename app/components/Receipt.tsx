// components/Receipt.tsx (client)
"use client";
import React, { forwardRef } from "react";

type OrderItem = {
  quantity?: number | null;
  priceAtSale?: number | null;
  product?: { id?: string; name?: string | null; price?: number | null } | null;
};

type Order = {
  id: string;
  nickname?: string | null;
  paymentmethod?: string | null;
  status?: string | null;
  sellDate?: string | Date;
  total:number;
  items: OrderItem[];
};

interface ReceiptProps { order: Order }

const Receipt = forwardRef<HTMLDivElement, ReceiptProps>(({ order }, ref) => {
  const total = order.items.reduce((sum, item) => {
    const qty = item.quantity ?? 0;
    const price = item.priceAtSale ?? item.product?.price ?? 0;
    return sum + price * qty;
  }, 0);

  return (
    <div ref={ref} className="p-4 bg-white text-black max-w-sm mx-auto border rounded-md">
      <h1 className="text-center font-bold text-lg">Moto Refacciones Pinos 32</h1>
      <p className="text-center text-sm mb-2">Grasias por su compra</p>

      <hr className="my-2" />
      <p>Order ID: {order.id}</p>
      {order.nickname && <p>Customer: {order.nickname}</p>}
      {order.paymentmethod && <p>Payment: {order.paymentmethod}</p>}
      {order.status && <p>Status: {order.status}</p>}
      {order.sellDate && <p>Date: {new Date(order.sellDate).toLocaleString()}</p>}
      <hr className="my-2" />

      <div>
        {order.items.map((item, i) => {
          const productName = item.product?.name ?? "Unknown Product";
          const price = item.priceAtSale ?? item.product?.price ?? 0;
          const quantity = item.quantity ?? 0;
          const subtotal = price * quantity;

          return (
            <div key={i} className="flex justify-between text-sm">
              <span>{productName} x{quantity}</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
          );
        })}
      </div>

      <hr className="my-2" />
      <p className="text-right font-bold text-lg">Total: ${total.toFixed(2)}</p>
    </div>
  );
});

Receipt.displayName = "Receipt";
export default Receipt;
