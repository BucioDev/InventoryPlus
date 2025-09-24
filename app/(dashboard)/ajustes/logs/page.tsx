import prisma from "@/app/lib/prisma";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";


async function getLogs(){
    const data = await prisma.log.findMany({
        select:{
            id:true,
            action:true,
            createdAt:true,
            user:{
                select:{
                    username:true,
                }
            }
        },
        orderBy:{
            createdAt:"desc",
        }
    });
    return data;
}

function formatLogDate(date: Date) {
    const d = new Intl.DateTimeFormat("es-MX", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  
    const t = new Intl.DateTimeFormat("es-MX", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true, // 24h format, remove if you want AM/PM
    }).format(date);
  
    return { d, t };
  }
export default async function LogsPage() {
    const logs = await getLogs();

    return(
        <>
        <Card className="mt-5">
            <CardHeader>
                <CardTitle>
                Registros de actividad
                </CardTitle>
                <CardDescription>
                Actividades realizadas por los usuarios
            </CardDescription>
            </CardHeader>
            <CardContent>
                {logs.map((log)=>{
                    const { d, t } = formatLogDate(log.createdAt);
                    return(
                        <div key={log.id} className="flex flex-col gap-3">
                        <h1> {log.user?.username} {log.action} el {d} a las {t}</h1>
                        <Separator/>
                    </div>
                    
                    )
                })}
            </CardContent>
        </Card>
        </>
    )
}