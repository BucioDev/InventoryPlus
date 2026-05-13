import prisma from "@/app/lib/prisma";
import { NextResponse } from "next/server";




export async function GET(req: Request){
    const { searchParams } = new URL(req.url);

    const phone = searchParams.get("phone") || "";

    try {

        const cliente = await prisma.clientes.findFirst({
            select:{
                id:true,
                nombre:true,
                descuento:true,
            },
            where:{
                isDeleted:false,
                codigo:phone,
            },
        });

        return NextResponse.json(cliente);

    } catch (err) {
        console.error("Error fetching Cliente: ", err);
        return NextResponse.json(
            { error: "Failded to fetch products"},
            { status: 500 }
        );
    }
}