import prisma from "@/app/lib/prisma";
import { NextResponse } from "next/server";



export async function GET(){
    const count = await prisma.clientes.count({
        where:{
            isDeleted:false,
        }
    });

    return NextResponse.json(count);
}