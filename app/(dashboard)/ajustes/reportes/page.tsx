"use client"
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { CalendarIcon, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
function formatDate(date: Date | undefined) {
    if (!date) return ""
  
    return date.toLocaleDateString("es-MX", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    })
  }
  
  function isValidDate(date: Date | undefined) {
    if (!date) return false
    return !isNaN(date.getTime())
  }
  
  type Sucursal = {
    id: string;
    name: string;
  };
  
  type User = {
    id: string;
    firstName: string;
    lastName: string;
  }
  
  export default function ReportsPage() {
  
    const [open, setOpen] = useState(false)
    const [open2, setOpen2] = useState(false)
  
    const [startDate, setStartDate] = useState<Date | undefined>(new Date())
    const [endDate, setEndDate] = useState<Date | undefined>(new Date())
  
    const [month1, setMonth1] = useState<Date | undefined>(startDate)
    const [month2, setMonth2] = useState<Date | undefined>(endDate)
  
    const [fechaInicio, setFechaInicio] = useState(formatDate(startDate))
    const [fechaFin, setFechaFin] = useState(formatDate(endDate))
  
    const [type, setType] = useState("all");
    const [sucursales, setSucursales] = useState<Sucursal[]>([]);
    const [usuarios, setUsuarios] = useState<User[]>([]);
  
    const [selectedUser, setSelectedUser] = useState<string>("all");
    const [selectedLocation, setSelectedLocation] = useState<string>("all");
    const [selectedLocation2, setSelectedLocation2] = useState<string>("all");
  
    useEffect(() => {
      const fetchSucursales = async () => {
        const res = await fetch("/api/sucursales");
        const data: Sucursal[] = await res.json();
        setSucursales(data)
      };
  
      const fetchUsuarios = async () => {
        const res = await fetch("/api/usuarios");
        const data: User[] = await res.json();
        setUsuarios(data)
      };
  
      fetchSucursales().then(fetchUsuarios);
    }, [])
  
    return (
      <>
        <Button asChild className="mt-5">
          <Link href="/ajustes">
            <ChevronLeft />
          </Link>
        </Button>
        <div className="grid grid-cols-2 gap-4">
        <Card className="mt-5">
          <CardHeader>
            <CardTitle>Reportes de Ventas</CardTitle>
          </CardHeader>
  
          <CardContent>
            <div className="flex flex-col gap-6 mt-5">
  
              {/* REPORT TYPE */}
              <div className="flex flex-col gap-3">
                <Label>Tipo de Reporte</Label>
                <Select onValueChange={setType} defaultValue="all">
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar Reporte" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los reportes</SelectItem>
                    <SelectItem value="summary">Resumen General</SelectItem>
                    <SelectItem value="byUser">Ventas por Usuario</SelectItem>
                    <SelectItem value="byLocation">Ventas por Sucursal</SelectItem>
                    <SelectItem value="profit">Ganancia</SelectItem>
                    <SelectItem value="timeSeries">Ventas por Fecha</SelectItem>
                  </SelectContent>
                </Select>
              </div>
  
              {/* START DATE */}
              <div className="flex flex-col gap-3">
                <Label>Fecha de inicio</Label>
                <div className="relative flex gap-2 max-w-xs">
                  <Input
                    value={fechaInicio}
                    onChange={(e) => {
                      const d = new Date(e.target.value)
                      setFechaInicio(e.target.value)
                      if (isValidDate(d)) {
                        setStartDate(d)
                        setMonth1(d)
                      }
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "ArrowDown") {
                        e.preventDefault()
                        setOpen(true)
                      }
                    }}
                  />
  
                  <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                      <Button variant="ghost" className="absolute top-1/2 right-2 size-6 -translate-y-1/2">
                        <CalendarIcon className="size-3.5" />
                      </Button>
                    </PopoverTrigger>
  
                    <PopoverContent className="w-auto p-0" align="end">
                      <Calendar
                        mode="single"
                        selected={startDate}
                        month={month1}
                        onMonthChange={setMonth1}
                        onSelect={(d) => {
                          setStartDate(d)
                          setFechaInicio(formatDate(d))
                          setOpen(false)
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
  
              {/* END DATE */}
              <div className="flex flex-col gap-3">
                <Label>Fecha final</Label>
                <div className="relative flex gap-2 max-w-xs">
                  <Input
                    value={fechaFin}
                    onChange={(e) => {
                      const d = new Date(e.target.value)
                      setFechaFin(e.target.value)
                      if (isValidDate(d)) {
                        setEndDate(d)
                        setMonth2(d)
                      }
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "ArrowDown") {
                        e.preventDefault()
                        setOpen2(true)
                      }
                    }}
                  />
  
                  <Popover open={open2} onOpenChange={setOpen2}>
                    <PopoverTrigger asChild>
                      <Button variant="ghost" className="absolute top-1/2 right-2 size-6 -translate-y-1/2">
                        <CalendarIcon className="size-3.5" />
                      </Button>
                    </PopoverTrigger>
  
                    <PopoverContent className="w-auto p-0" align="end">
                      <Calendar
                        mode="single"
                        selected={endDate}
                        month={month2}
                        onMonthChange={setMonth2}
                        onSelect={(d) => {
                          setEndDate(d)
                          setFechaFin(formatDate(d))
                          setOpen2(false)
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
  
              {/* USER FILTER */}
              <div className="flex flex-col gap-3">
                <Label>Usuario (Opcional)</Label>
                <Select onValueChange={setSelectedUser} defaultValue="all">
                  <SelectTrigger>
                    <SelectValue placeholder="Todos los usuarios" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    {usuarios.map((usuario) => (
                      <SelectItem key={usuario.id} value={usuario.id}>
                        {usuario.firstName} {usuario.lastName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
  
              {/* LOCATION FILTER */}
              <div className="flex flex-col gap-3">
                <Label>Sucursal (Opcional)</Label>
                <Select onValueChange={setSelectedLocation} defaultValue="all">
                  <SelectTrigger>
                    <SelectValue placeholder="Todas las sucursales" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas</SelectItem>
                    {sucursales.map((sucursal) => (
                      <SelectItem key={sucursal.id} value={sucursal.name}>
                        {sucursal.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
  
            </div>
          </CardContent>
  
          <CardFooter>
            <Button
              className="mt-6 w-full"
              onClick={() => {
                printSalesReport(
                  type,
                  startDate?.toISOString(),
                  endDate?.toISOString(),
                  selectedUser,
                  selectedLocation
                );
              }}
            >
              Generar Reporte
            </Button>
          </CardFooter>
        </Card>
        <Card className="mt-5">
              <CardHeader>
                <CardTitle>Reportes de Inventario</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-6">

                  <div className="flex flex-col gap-3">
                    <Label>Seleccionar la susucursal</Label>
                    <Label>Sucursal </Label>
                    <Select onValueChange={setSelectedLocation2} defaultValue="all">
                      <SelectTrigger>
                        <SelectValue placeholder="Todas las sucursales" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todas</SelectItem>
                        {sucursales.map((sucursal) => (
                          <SelectItem key={sucursal.id} value={sucursal.name}>
                            {sucursal.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                

              </CardContent>
              <CardFooter>
                <Button className="mt-6 w-full"
                onClick={() =>{
                  printInventarioReport(selectedLocation2)
                }}>
                  Generar reporte de faltas en stock</Button>
              </CardFooter>
        </Card>
        </div>
      </>
    )
  }



async function printSalesReport(
    type = "all",
    startDate?: string,
    endDate?: string,
    user = "all",
    location = "all"
  ) {
    const url = new URL("/api/reportes/ventas", window.location.origin);
  
    url.searchParams.set("type", type);
    url.searchParams.set("user", user);
    url.searchParams.set("location", location);
  
    if (startDate) url.searchParams.set("startDate", startDate);
    if (endDate) url.searchParams.set("endDate", endDate);
  
    const data = await fetch(url).then((res) => res.json());
  
    const formatCurrency = (value: number) =>
      new Intl.NumberFormat("es-MX", {
        style: "currency",
        currency: "MXN",
      }).format(value);
  
    const formatDate = (date: string) =>
      new Date(date).toLocaleString("es-MX");
  
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;
  
    printWindow.document.write(`
      <html>
        <head>
          <title>Reporte de Ventas</title>
          <style>
            body { font-family: Arial; padding: 30px; color: #111; }
            h1 { text-align: center; margin-bottom: 5px; }
            .subtitle { text-align: center; color: #666; margin-bottom: 30px; }
            h2 { margin-top: 40px; border-bottom: 2px solid #eee; padding-bottom: 5px; }
            table { width: 100%; border-collapse: collapse; margin-top: 15px; }
            th, td { border: 1px solid #ddd; padding: 10px; text-align: left; }
            th { background: #f5f5f5; }
            .summary { display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; margin-top: 20px; }
            .card {
              border: 1px solid #ddd;
              border-radius: 8px;
              padding: 15px;
              text-align: center;
            }
            .card h3 { margin: 0; font-size: 14px; color: #666; }
            .card p { margin: 5px 0 0; font-size: 18px; font-weight: bold; }
          </style>
        </head>
        <body>
          <h1>Reporte de Ventas</h1>
          <div class="subtitle">
            ${startDate ? formatDate(startDate) : ""} - ${endDate ? formatDate(endDate) : ""}
          </div>
  
          ${
            data.summary
              ? `
            <h2>Resumen General</h2>
            <div class="summary">
              <div class="card">
                <h3>Ventas Totales</h3>
                <p>${formatCurrency(data.summary.totalSales)}</p>
              </div>
              <div class="card">
                <h3>Órdenes</h3>
                <p>${data.summary.totalOrders}</p>
              </div>
              <div class="card">
                <h3>Ganancia</h3>
                <p>${formatCurrency(data.summary.profit)}</p>
              </div>
              <div class="card">
                <h3>Gastos</h3>
                <p>${formatCurrency(data.summary.totalExpenses)}</p>
              </div>
              <div class="card">
                <h3>Ganancia Neta</h3>
                <p>${formatCurrency(data.summary.netProfit)}</p>
              </div>
            </div>
          `
              : ""
          }
  
          ${data.byLocation
            ? `
            <h2>Ventas por Sucursal (Detalle Completo)</h2>
            ${data.byLocation
              .map(
                (loc: any) => `
                <h3>${loc.location}</h3>
                <p><strong>Total:</strong> ${formatCurrency(loc.totalSales)} | ${loc.orders} órdenes</p>
          
                <table>
                  <tr>
                    <th>Fecha y Hora</th>
                    <th>Total</th>
                  </tr>
                  ${loc.breakdown
                    .map(
                      (b: any) => `
                    <tr>
                      <td>${b.date ? formatDate(b.date) : "Sin fecha"}</td>
                      <td>${formatCurrency(b.total)}</td>
                    </tr>
                  `
                    )
                    .join("")}
                </table>
              `
              )
              .join("")}
          `
            : ""
          }
  
          ${data.byUser
            ? `
            <h2>Ventas por Usuario (Detalle Completo)</h2>
            ${data.byUser
              .map(
                (user: any) => `
                <h3>${user.user}</h3>
                <p><strong>Total:</strong> ${formatCurrency(user.totalSales)} | ${user.orders} órdenes</p>
          
                <table>
                  <tr>
                    <th>Fecha y Hora</th>
                    <th>Total</th>
                  </tr>
                  ${user.breakdown
                    .map(
                      (b: any) => `
                    <tr>
                      <td>${b.date ? formatDate(b.date) : "Sin fecha"}</td>
                      <td>${formatCurrency(b.total)}</td>
                    </tr>
                  `
                    )
                    .join("")}
                </table>
              `
              )
              .join("")}
          `
            : ""
          }
  
          ${
            data.profit
              ? `
            <h2>Ganancia por Sucursal</h2>
            <table>
              <tr>
                <th>Sucursal</th>
                <th>Ventas</th>
                <th>Costo</th>
                <th>Ganancia</th>
              </tr>
              ${data.profit
                .map(
                  (row: any) => `
                <tr>
                  <td>${row.location}</td>
                  <td>${formatCurrency(row.totalSales)}</td>
                  <td>${formatCurrency(row.totalCost)}</td>
                  <td>${formatCurrency(row.profit)}</td>
                </tr>
              `
                )
                .join("")}
            </table>
          `
              : ""
          }
  
          ${
            data.timeSeries
              ? `
            <h2>Ventas por Fecha</h2>
            <table>
              <tr>
                <th>Fecha</th>
                <th>Total</th>
              </tr>
              ${data.timeSeries
                .map(
                  (row: any) => `
                <tr>
                  <td>${row.date}</td>
                  <td>${formatCurrency(row.total)}</td>
                </tr>
              `
                )
                .join("")}
            </table>
          `
              : ""
          }
  
        </body>
      </html>
    `);
  
    printWindow.document.close();
    printWindow.print();
  }


async function printInventarioReport(
    selectedLocation2 = "all"
  ) {
    const url = new URL(
      "/api/reportes/inventario",
      window.location.origin
    );
  
    url.searchParams.set("location", selectedLocation2);
  
    const response = await fetch(url);
  
    if (!response.ok) {
      console.error("Error al obtener el reporte de inventario");
      return;
    }
  
    const data = await response.json();
  
    const printWindow = window.open("", "_blank");
  
    if (!printWindow) return;
  
    printWindow.document.write(`
      <html>
        <head>
          <title>Reporte de Inventario</title>
  
          <style>
            body {
              font-family: Arial, sans-serif;
              padding: 30px;
              color: #111;
              margin: 0;
            }

            h1 {
              text-align: center;
              margin-bottom: 5px;
            }

            .subtitle {
              text-align: center;
              color: #666;
              margin-bottom: 30px;
            }

            .location {
              margin-top: 30px;

              /* IMPORTANT:
                Allow the location to continue across pages */
              page-break-inside: auto;
              break-inside: auto;
            }

            .location-title {
              font-size: 22px;
              margin-bottom: 20px;
              border-bottom: 2px solid #111;
              padding-bottom: 8px;

              /* Keep the title with the content below it */
              page-break-after: avoid;
              break-after: avoid;
            }

            h3 {
              margin-top: 20px;
              margin-bottom: 10px;

              /* Don't leave a heading alone at the bottom */
              page-break-after: avoid;
              break-after: avoid;
            }

            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 10px;
              margin-bottom: 25px;

              /* IMPORTANT:
                Allow tables to flow across pages */
              page-break-inside: auto;
              break-inside: auto;
            }

            /* Repeat table headers when a table continues
              onto another page */
            thead {
              display: table-header-group;
            }

            /* Don't split individual rows */
            tr {
              page-break-inside: avoid;
              break-inside: avoid;
            }

            th,
            td {
              border: 1px solid #ddd;
              padding: 10px;
              text-align: left;
            }

            th {
              background: #f5f5f5;
            }

            .empty {
              color: #777;
              font-style: italic;
              margin-bottom: 25px;
            }

            .date {
              text-align: right;
              color: #666;
              font-size: 12px;
              margin-bottom: 30px;
            }

            @media print {
              body {
                padding: 15px;
              }

              .location {
                page-break-inside: auto;
                break-inside: auto;
              }

              table {
                page-break-inside: auto;
                break-inside: auto;
              }

              tr {
                page-break-inside: avoid;
                break-inside: avoid;
              }
            }
          </style>
        </head>
  
        <body>
  
          <h1>Reporte de Inventario</h1>
  
          <div class="subtitle">
            ${
              selectedLocation2 === "all"
                ? "Todas las sucursales"
                : selectedLocation2
            }
          </div>
  
          <div class="date">
            Generado: ${new Date().toLocaleString("es-MX")}
          </div>
  
          ${
            data.locations && data.locations.length > 0
              ? data.locations
                  .map(
                    (location: any) => `
                      <div class="location">
  
                        <div class="location-title">
                          ${location.location}
                        </div>
  
                        ${
                          location.outOfStock &&
                          location.outOfStock.length > 0
                            ? `
                              <h3>
                                Productos agotados
                              </h3>
  
                              <table>
                                <thead>
                                  <tr>
                                    <th>Código</th>
                                    <th>Descripción</th>
                                    <th>Stock</th>
                                  </tr>
                                </thead>
  
                                <tbody>
                                  ${location.outOfStock
                                    .map(
                                      (product: any) => `
                                        <tr>
                                          <td>
                                            ${product.barcode}
                                          </td>
  
                                          <td>
                                            ${product.name}
                                          </td>
  
                                          <td>
                                            ${product.stock}
                                          </td>
                                        </tr>
                                      `
                                    )
                                    .join("")}
                                </tbody>
                              </table>
                            `
                            : ""
                        }
  
                        ${
                          location.lowStock &&
                          location.lowStock.length > 0
                            ? `
                              <h3>
                                Productos con stock bajo
                              </h3>
  
                              <table>
                                <thead>
                                  <tr>
                                    <th>Código</th>
                                    <th>Descripción</th>
                                    <th>Stock</th>
                                    <th>Stock mínimo</th>
                                  </tr>
                                </thead>
  
                                <tbody>
                                  ${location.lowStock
                                    .map(
                                      (product: any) => `
                                        <tr>
                                          <td>
                                            ${product.barcode}
                                          </td>
  
                                          <td>
                                            ${product.name}
                                          </td>
  
                                          <td>
                                            ${product.stock}
                                          </td>
  
                                          <td>
                                            ${product.alertammount}
                                          </td>
                                        </tr>
                                      `
                                    )
                                    .join("")}
                                </tbody>
                              </table>
                            `
                            : ""
                        }
  
                        ${
                          (!location.outOfStock ||
                            location.outOfStock.length === 0) &&
                          (!location.lowStock ||
                            location.lowStock.length === 0)
                            ? `
                              <p class="empty">
                                No hay productos agotados o con stock bajo.
                              </p>
                            `
                            : ""
                        }
  
                      </div>
                    `
                  )
                  .join("")
              : `
                <p class="empty">
                  No se encontraron productos con stock agotado o bajo.
                </p>
              `
          }
  
        </body>
      </html>
    `);
  
    printWindow.document.close();
  
    printWindow.focus();
  
    printWindow.print();
  }