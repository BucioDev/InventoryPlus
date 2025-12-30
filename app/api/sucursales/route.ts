import prisma from "@/app/lib/prisma";
import { NextResponse } from "next/server";



export async function GET(){
    const categorias = await prisma.sucursales.findMany({
        select:{
            id:true,
            name:true,
        },
        where:{
            isDeleted:false,
        }
    });

    return NextResponse.json(categorias);
}