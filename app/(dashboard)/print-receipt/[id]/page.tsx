import { getOrderData, isLoggedIn } from "@/app/actions";
import AutoPrintReceipt from "@/app/components/AutoPrintReceipt";

export default async function PrintReceiptPage({ params }:{params:Promise<{id:string}>}) {
  const {id} = await params;
  const order = await getOrderData(id);
  const session = await isLoggedIn();

  if (!order) return <p>Order not found</p>;

  return <AutoPrintReceipt order={order} username={session.firstName as string}/>;
}
