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
import { string } from "zod";

function formatDate(date: Date | undefined) {
  if (!date) {
    return ""
  }

  return date.toLocaleDateString("es-MX", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  })
}

function isValidDate(date: Date | undefined) {
  if (!date) {
    return false
  }
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
export default function ReportsPage(){

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
            <ChevronLeft/>
            </Link>
        </Button>
        <Card className="mt-5">
            <CardHeader>
                <CardTitle>
                    Reportes
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col gap-6 mt-5">
                    <div className="flex flex-col gap-3">
                        <Label>Reporte a Generar</Label>

                        <Select onValueChange={setType} defaultValue="all">
                                <SelectTrigger>
                                    <SelectValue placeholder="Seleccionar Reporte"/>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Todos los reportes</SelectItem>
                                    <SelectItem value="byUser">Reporte de Venta por Usuario</SelectItem>
                                    <SelectItem value="byLocation">Reporte de Venta por Sucursal</SelectItem>
                                </SelectContent>
                        </Select>
                    </div>
                   <div className="flex flex-col gap-3">
                    <Label>Fecha de inicio del Reporte</Label>

                    <div className="relative flex gap-2 max-w-2xs">
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

                        <PopoverContent className="w-auto overflow-hidden p-0" align="end">
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

                    {/* DATE PICKER 2 */}
                    <div className="flex flex-col gap-3">
                    <Label>Fecha de final del Reporte</Label>

                    <div className="relative flex gap-2 max-w-2xs">
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

                        <PopoverContent className="w-auto overflow-hidden p-0" align="end">
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
                    {type === "byUser" && (
                    <div className="flex flex-col gap-3">
                        <Label>Seleccionar Usuario</Label>
                        <Select onValueChange={setSelectedUser} defaultValue="all">
                        <SelectTrigger>
                            <SelectValue placeholder="Seleccionar Usuario" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Todos los usuarios</SelectItem>
                            {usuarios.map((usuario) => (
                            <SelectItem key={usuario.id} value={usuario.id}>
                                {usuario.firstName} {usuario.lastName}
                            </SelectItem>
                            ))}
                        </SelectContent>
                        </Select>
                    </div>
                    )}

                    {type === "byLocation" && (
                        <div className="flex flex-col gap-3">
                            <Label>Seleccionar Sucursal</Label>
                            <Select onValueChange={setSelectedLocation} defaultValue="all">
                            <SelectTrigger>
                                <SelectValue placeholder="Seleccionar Sucursal" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todas las sucursales</SelectItem>
                                {sucursales.map((sucursal) => (
                                <SelectItem key={sucursal.id} value={sucursal.id}>
                                    {sucursal.name}
                                </SelectItem>
                                ))}
                            </SelectContent>
                            </Select>
                        </div>
                        )}
            </div>
            </CardContent>
            <CardFooter>
                <Button className="mt-6 w-full" onClick={() => {
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

  const printWindow = window.open("", "_blank");
  if (!printWindow) return;

  printWindow.document.write(`
    <html>
      <head>
        <title>Reporte de Ventas</title>
        <style>
          body { font-family: Arial; padding: 20px; }
          h1 { text-align: center; }
          h2 { margin-top: 40px; }
          table { width: 100%; border-collapse: collapse; margin-top: 10px; }
          th, td { border: 1px solid #ccc; padding: 8px; }
          th { background: #f2f2f2; }
        </style>
      </head>
      <body>
        <h1>Reporte de Ventas</h1>
        ${data.profit ? `...` : ""}
        ${data.byLocation ? `...` : ""}
        ${data.byUser ? `...` : ""}
      </body>
    </html>
  `);

  printWindow.document.close();
  printWindow.print();
}
