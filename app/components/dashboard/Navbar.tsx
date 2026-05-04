
import LogoutForm from "../logoutForm";
import NavbarLinks from "./NavbarLinks";
import NotificationBox from "../NotificationsBox";
import MobileNavBar from "./MobileNavBar";
import { getSesion } from  "@/app/actions"
import VendorNavbar from "./VendorNavbar"

type NavbarClientProps = {
    isVendor: boolean;
};

export default function Navbar({ isVendor }: NavbarClientProps) {
    return (
        <div className="w-full max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex items-center justify-between bg-black text-white rounded-b-lg">
            
            <div className="hidden md:flex md:items-center">
                {isVendor ? <VendorNavbar /> : <NavbarLinks />}
            </div>

            <div className="flex items-center justify-between w-full md:hidden">
                <MobileNavBar  />
            </div>

            <div className="flex gap-6">
                <NotificationBox />
                <LogoutForm />
            </div>
        </div>
    );
}