import prisma from "@/app/lib/prisma";
import { NextResponse } from "next/server";



export async function GET(){
    const notificaciones = await prisma.notifications.findMany({
        orderBy:{
            createdAt:"desc"
        }
    });

    return NextResponse.json(notificaciones);
}