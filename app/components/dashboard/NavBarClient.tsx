import { getSesion } from "@/app/actions";
import Navbar from "./Navbar";


export default async function NavbarClient() {
    const session = await getSesion();
    const isVendor = session?.role === "vendor";
    return (
        <Navbar isVendor={isVendor}  />
    );
}