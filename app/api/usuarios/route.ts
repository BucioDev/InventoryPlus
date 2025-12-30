import prisma from "@/app/lib/prisma";
import { NextResponse } from "next/server";



export async function GET(){
    const categorias = await prisma.user.findMany({
        select:{
            id:true,
            lastName:true,
            firstName:true,
        },
        where:{
            isDeleted:false,
        }
    });

    return NextResponse.json(categorias);
}