import { getOrderData, isLoggedIn } from "@/app/actions";
import AutoPrintReceipt from "@/app/components/AutoPrintReceipt";

export default async function PrintReceiptPage({ params }: { params: { id: string } }) {
  const order = await getOrderData(params.id);
  const session = await isLoggedIn();

  if (!order) return <p>Order not found</p>;

  return <AutoPrintReceipt order={order} username={session.firstName as string}/>;
}
