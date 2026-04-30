import EditOrderForm from "@/app/components/dashboard/forms/EditOrderForm";
import prisma from "@/app/lib/prisma";
import { notFound } from "next/navigation";
import { resourceUsage } from "process";
import { da } from "zod/v4/locales";



async function GetOrder(id:string){

    const data = await prisma.order.findUnique({
        where:{
            id:id
        },
        select:{
            id:true,
            nickname:true,
            status:true,
            total:true,
            paymentmethod:true,
            location:true,
            debt:true,
            pay_debt:true,
            items:{
                select:{
                    quantity:true,
                    priceAtSale:true,
                    productId:true,
                    product:{
                        select:{
                            id:true,
                            name:true,
                            sellprice:true,
                            images:true,
                        }
                    }
                    
                }
            }
        }
    })

    if(!data){
        return notFound()
    }
    return data
}

export default async function EditOrderPage({params}:{params:Promise<{id:string}>}){
    const {id} = await params;
    const order = await GetOrder(id);

    return(
        <>
        <EditOrderForm data={order} />
        </>
    )
}