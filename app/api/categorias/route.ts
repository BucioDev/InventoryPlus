import prisma from "@/app/lib/prisma";
import { NextResponse } from "next/server";



export async function GET(){
    const categorias = await prisma.category.findMany({
        where:{
            isDeleted:false,
        }
    });

    return NextResponse.json(categorias);
}