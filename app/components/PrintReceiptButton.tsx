"use client";

import React, { useRef } from "react";
import Receipt from "./Receipt";

interface PrintReceiptButtonProps {
  order: any;
  username:string;
}

export default function PrintReceiptButton({ order, username }: PrintReceiptButtonProps) {
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    const printContent = printRef.current;
    if (!printContent) return;

    const printWindow = window.open("", "_blank", "width=400,height=600");
    if (!printWindow) return;

    printWindow.document.write(`
      <html>
        <head>
          <title>Receipt</title>
          <style>
            @media print {
              body { font-family: sans-serif; }
            }
          </style>
        </head>
        <body>
          ${printContent.innerHTML}
          <script>
            window.onload = function() {
              window.print();
              window.onafterprint = window.close;
            }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <>
      {/* Hidden receipt for print cloning */}
      <div className="hidden">
        <div ref={printRef}>
          <Receipt order={order} username={username}/>
        </div>
      </div>

      <button
        onClick={handlePrint}
        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
      >
        Imprimir Recibo
      </button>
    </>
  );
}
