"use client";

import React, { forwardRef } from "react";

type Order = {
  id: string;
  nickname?: string | null;
  total: number;
  realTotal?: number | null;
  status?: string | null;
  location?: string | null;
  debt?: number | null;
  pay_debt?: number | null;
  last_payment?: number | null;
  change?: number | null;
  paymentmethod?: string | null;
  sellDate?: string | Date | null;
  createdAt?: string | Date | null;
  updatedAt?: string | Date | null;
  user: {
    firstName: string;
  };
};

interface EndShiftReceiptProps {
  orders: Order[];
  username: string;
  startTime?: string | Date;
}

const EndShiftReceipt = forwardRef<
  HTMLDivElement,
  EndShiftReceiptProps
>(({ orders, username, startTime }, ref) => {
  const formatMoney = (value: number) =>
    `$${value.toFixed(2)}`;

  const totalSales = orders.reduce(
    (sum, order) => sum + (order.realTotal ?? order.total ?? 0),
    0
  );

  const paymentTotals: Record<string, number> = {};

  orders.forEach((order) => {
    const method = order.paymentmethod || "Otro";

    const amount =
      order.realTotal ?? order.total ?? 0;

    paymentTotals[method] =
      (paymentTotals[method] || 0) + amount;
  });

  return (
    <div
      ref={ref}
      className="printable"
      style={{
        width: "72mm",
        padding: "8px",
        background: "white",
        color: "black",
        fontFamily: '"Courier New", monospace',
        fontSize: "11px",
        lineHeight: "1.35",
      }}
    >
      <div style={{ textAlign: "center" }}>
        <div
          style={{
            fontWeight: "bold",
            fontSize: "16px",
          }}
        >
          Moto Refacciones Pinos 32
        </div>

        <div
          style={{
            fontWeight: "bold",
            marginTop: "4px",
          }}
        >
          REPORTE DE VENTAS
        </div>

        <div>FIN DE TURNO</div>
      </div>

      <hr style={{ margin: "8px 0" }} />

      <div>
        <div>
          Cajero: {username || "Cajero"}
        </div>

        {startTime && (
          <div>
            Inicio:{" "}
            {new Date(startTime).toLocaleString("es-MX")}
          </div>
        )}

        <div>
          Ventas: {orders.length}
        </div>
      </div>

      <hr style={{ margin: "8px 0" }} />

      <div
        style={{
          fontWeight: "bold",
          textAlign: "center",
          marginBottom: "5px",
        }}
      >
        VENTAS REALIZADAS
      </div>

      {orders.length === 0 ? (
        <div style={{ textAlign: "center" }}>
          No se realizaron ventas
        </div>
      ) : (
        orders.map((order) => {
          const amount =
            order.realTotal ?? order.total ?? 0;

          return (
            <div
              key={order.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "3px",
              }}
            >
              <span>
                {order.nickname}
              </span>

              <span>
                {formatMoney(amount)}
              </span>
            </div>
          );
        })
      )}

      <hr style={{ margin: "8px 0" }} />

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontWeight: "bold",
          fontSize: "14px",
        }}
      >
        <span>TOTAL:</span>
        <span>{formatMoney(totalSales)}</span>
      </div>

      <hr style={{ margin: "8px 0" }} />

      <div
        style={{
          fontWeight: "bold",
          textAlign: "center",
          marginBottom: "5px",
        }}
      >
        POR MÉTODO DE PAGO
      </div>

      {Object.entries(paymentTotals).map(
        ([method, amount]) => (
          <div
            key={method}
            style={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <span>
              {method}
            </span>

            <span>
              {formatMoney(amount)}
            </span>
          </div>
        )
      )}

      <hr style={{ margin: "8px 0" }} />

      <div style={{ textAlign: "center" }}>
        Gracias por su trabajo
      </div>

      <div style={{ height: "50px" }} />
    </div>
  );
});

EndShiftReceipt.displayName = "EndShiftReceipt";

export default EndShiftReceipt;