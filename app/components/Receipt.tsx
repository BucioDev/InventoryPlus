// components/Receipt.tsx
"use client";

import React, { forwardRef } from "react";
import Barcode from "react-barcode";

type OrderItem = {
  quantity?: number | null;
  priceAtSale?: number | null;
  product?: {
    id?: string;
    name?: string | null;
    sellprice?: number | null;
  } | null;
};

type User = {
  firstName: string;
};

type Cliente = {
  nombre: string;
  codigo:string;
};

type Order = {
  id: string;
  nickname?: string | null;
  paymentmethod?: string | null;
  status?: string | null;
  sellDate?: string | Date;

  total: number;
  realTotal?: number | null;

  debt?: number | null;
  pay_debt?: number | null;
  last_payment?: number | null;
  change?: number | null;

  descuento?: number | null;

  items: OrderItem[];

  user: User;

  cliente?: Cliente | null;
};

interface ReceiptProps {
  order: Order;
  username: string;
}

const Receipt = forwardRef<HTMLDivElement, ReceiptProps>(
  ({ order, username }, ref) => {
    const hasDiscount =
      !!order.cliente && (order.descuento ?? 0) > 0;

    const normalTotal = order.total ?? 0;

    const finalTotal = hasDiscount
      ? order.realTotal ?? normalTotal
      : normalTotal;

    return (
      <div
        ref={ref}
        className="printable bg-white text-black p-2"
      >
        <h1 className="text-center font-bold text-lg">
          Moto Refacciones Pinos 32
        </h1>

        <p className="text-center text-sm mb-2">
          Gracias por su compra
        </p>

        <hr className="my-2" />
        <p>Order ID: {order.id}</p>
        <div className="flex flex-col items-center my-1">
          <Barcode
            value={order.id}
            height={40}
            width={1.5}
            fontSize={12}
            margin={0}
            displayValue={false}
          />
        </div>

        {order.user.firstName && (
          <p>Cajero: {username || "Cajero"}</p>
        )}

        {order.nickname && (
          <p>Cliente: {order.nickname}</p>
          
        )}

        {hasDiscount && (
          <div>
            <p>Codigo de Cliente / Telefono: {order.cliente?.codigo}</p>
          <p>
            Descuento aplicado: {order.descuento}%
          </p>
          </div>
        )}

        {order.paymentmethod && (
          <p>Metodo de pago: {order.paymentmethod}</p>
        )}

        {order.sellDate && (
          <p>
            Fecha:{" "}
            {new Date(order.sellDate).toLocaleString()}
          </p>
        )}

        <hr className="my-2" />

        <div
          className="mt-2 text-sm font-mono w-full"
          style={{
            fontFamily: '"Courier New", monospace',
            whiteSpace: "pre",
          }}
        >
          {order.items.map((item, i) => {
            const name =
              item.product?.name ?? "Unknown Product";

            const originalPrice =
              item.priceAtSale ??
              item.product?.sellprice ??
              0;

            const qty = item.quantity ?? 0;

            const discountedPrice = hasDiscount
              ? originalPrice *
                (1 - (order.descuento ?? 0) / 100)
              : originalPrice;

            const originalSubtotal =
              originalPrice * qty;

            const discountedSubtotal =
              discountedPrice * qty;

            // PUBLICO GENERAL
            if (!hasDiscount) {
              const formattedLine =
                name.padEnd(20, "\u00A0") +
                qty
                  .toString()
                  .padStart(2, "\u00A0") +
                (
                  "$" + originalSubtotal.toFixed(2)
                ).padStart(10, "\u00A0");

              return (
                <div key={i}>
                  {formattedLine}
                </div>
              );
            }

            // CLIENTE CON DESCUENTO
            return (
              <div key={i} className="mb-2">
                <div className="flex justify-between items-start">
                  <div className="max-w-[75%] break-words">
                    {name} <s>${originalSubtotal.toFixed(2)}</s> ${discountedSubtotal.toFixed(2)}
                  </div>
                </div>
            
                <div className="text-xs">
                  Cantidad: {qty}
                </div>
              </div>
            );
          })}
        </div>

        <hr className="my-2" />

        {hasDiscount ? (
          <div className="text-right">
            <p className="text-sm">
              Subtotal: $
              {normalTotal.toFixed(2)}
            </p>

            <p className="text-sm">
              Descuento: {order.descuento}%
            </p>

            <p className="font-bold text-lg">
              Total Final: $
              {finalTotal.toFixed(2)}
            </p>
          </div>
        ) : (
          <p className="text-right font-bold text-lg">
            Total: ${normalTotal.toFixed(2)}
          </p>
        )}

        <hr className="my-2" />

        <div className="text-sm">
          {order.last_payment !== null &&
            order.last_payment !== undefined && (
              <p>
                Último pago: $
                {order.last_payment.toFixed(2)}
              </p>
            )}

          {order.paymentmethod === "efectivo" && (
            <p>
              Cambio: $
              {(order.change ?? 0).toFixed(2)}
            </p>
          )}

          {order.pay_debt !== null &&
            order.pay_debt !== undefined && (
              <p>
                Total pagado: $
                {order.pay_debt.toFixed(2)}
              </p>
            )}

          {order.debt !== null &&
            order.debt !== undefined && (
              <p className="font-bold">
                Deuda restante: $
                {order.debt.toFixed(2)}
              </p>
            )}
        </div>

        {/* Extra spacing so printer does not cut suddenly */}
        <div style={{ height: "80px" }} />
      </div>
    );
  }
);

Receipt.displayName = "Receipt";

export default Receipt;