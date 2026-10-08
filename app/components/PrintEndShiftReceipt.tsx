"use client";

import React, { useRef } from "react";
import EndShiftReceipt from "./dashboard/EndShiftReceipt";

interface PrintReceiptButtonProps {
  orders: any[];
  username: string;
  startTime: string | Date;
}

export default function PrintEndShiftReceiptButton({
  orders,
  username,
  startTime,
}: PrintReceiptButtonProps) {
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    const printContent = printRef.current;

    if (!printContent) return;

    const printWindow = window.open(
      "",
      "_blank",
      "width=400,height=600"
    );

    if (!printWindow) return;

    printWindow.document.write(`
      <html>
        <head>
          <title>Reporte de Ventas</title>

          <style>
            @page {
              size: 72mm auto;
              margin: 0;
            }

            html,
            body {
              width: 72mm;
              margin: 0;
              padding: 0;
              background: white;
            }

            body {
              font-family: "Courier New", monospace;
              color: black;
            }

            .printable {
              width: 72mm !important;
              box-sizing: border-box;
              padding: 8px !important;
              background: white !important;
              color: black !important;
              font-family: "Courier New", monospace !important;
              font-size: 11px !important;
              line-height: 1.35 !important;
            }

            @media print {
              html,
              body {
                width: 72mm;
                margin: 0;
                padding: 0;
              }
            }
          </style>
        </head>

        <body>
          ${printContent.innerHTML}

          <script>
            window.onload = function() {
              window.print();

              window.onafterprint = function() {
                window.close();
              };
            };
          </script>
        </body>
      </html>
    `);

    printWindow.document.close();
  };

  return (
    <>
      <div className="hidden">
        <div ref={printRef}>
          <EndShiftReceipt
            orders={orders}
            username={username}
            startTime={startTime}
          />
        </div>
      </div>

      <button
        onClick={handlePrint}
        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
      >
        Imprimir recibo de ventas
      </button>
    </>
  );
}