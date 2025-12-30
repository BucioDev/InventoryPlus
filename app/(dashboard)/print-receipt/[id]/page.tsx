import { getOrderData } from "@/app/actions";
import AutoPrintReceipt from "@/app/components/AutoPrintReceipt";

export default async function PrintReceiptPage({ params }: { params: { id: string } }) {
  const order = await getOrderData(params.id);

  if (!order) return <p>Order not found</p>;

  return <AutoPrintReceipt order={order} />;
}
