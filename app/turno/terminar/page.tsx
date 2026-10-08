import { closeShift, getSesion, isLoggedIn } from "@/app/actions";
import PrintEndShiftReceiptButton from "@/app/components/PrintEndShiftReceipt";
import { SubmitButton } from "@/app/components/SubmitButtons";
import LogoutForm from "@/app/components/logoutForm";
import prisma from "@/app/lib/prisma";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { notFound } from "next/navigation";

async function GetShift(userId: string) {
const shift = await prisma.shift.findFirst({
  where:{
    userID:userId,
    endTime:null,
  },
});

if (!shift){
  console.log("shift not found")
  return notFound();
}

return shift;
}


async function GetOrders() {
  const session = await getSesion();
  const userId = session.userId as string;

  const shift = await GetShift(userId);

  const startTime = new Date(shift.startTime);
  const endTime = new Date();

  const orders = await prisma.order.findMany({
    where: {
      userID: userId,
      status: "completada",

      OR: [
        {
          createdAt: {
            gte: startTime,
            lte: endTime,
          },
        },
        {
          updatedAt: {
            gte: startTime,
            lte: endTime,
          },
        },
      ],
    },
    select: {
      id: true,
      nickname: true,
      total: true,
      realTotal: true,
      status: true,
      location: true,
      debt: true,
      pay_debt: true,
      last_payment: true,
      change: true,
      paymentmethod: true,
      userID: true,
      sellDate: true,
      createdAt: true,
      updatedAt: true,
      user: {
        select: {
          firstName: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return {
    orders,
    startTime,
    endTime,
  };
}

export default async function TerminarTurnoPage() {
    const session = await isLoggedIn();
    const id = session.userId;
    const { orders, startTime } = await GetOrders();
    return (
        <div className="h-[80vh] w-full flex items-center justify-center">
            <Card className="w-full max-w-2xl">
                <CardHeader>
                    <CardTitle>Estas a punto de Cerrar tu turno estas seguro que esto es lo que quieres hacer?</CardTitle>
                    <CardDescription>recuerda impimir el ticket de ventas antes de cerrar turno</CardDescription>
                </CardHeader>
                <CardContent className="w-full flex justify-between">
                    <LogoutForm/>
                    <PrintEndShiftReceiptButton orders={orders} username={session.firstName ?? "Cajero"} startTime={startTime}/>
                        <form action={closeShift}>
                            <input type="hidden" name="userId" value={id}/>
                            <SubmitButton text="Cerrar Turno"/>
                        </form>
                    </CardContent>
            </Card>
        </div>
    )
}