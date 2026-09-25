import { getSesion } from "@/app/actions";
import Navbar from "./Navbar";


export default async function NavbarClient() {
    const session = await getSesion();
    const isVendor = session?.role === "vendor";
    const isSupervisor = session?.role === "supervisor"
    return (
        <Navbar isVendor={isVendor}
        isSupervisor={isSupervisor}  />
    );
}