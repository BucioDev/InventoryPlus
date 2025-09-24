import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { isLoggedIn } from "../actions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenuItem } from "@radix-ui/react-dropdown-menu";
import LogoutForm from "./logoutForm";
import Link from "next/link";

interface UserDropDownProps {
    userName:string,
    role:string,
    img:string,
}




export default async function UserDropDown({userName,role,img}:UserDropDownProps) {
    return(
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10">
                        <AvatarImage src={img}  alt="User image"/>
                        <AvatarFallback>{userName.slice(0,3)}</AvatarFallback>
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel>
                    <p className="text-sm font-medium leading-none">{userName}</p>
                    <p className="text-xs font-normal leading-none text-gray-500">{role}</p>
                </DropdownMenuLabel>
                <DropdownMenuSeparator/>
                <DropdownMenuItem asChild>
                    <Link href="/Logout">
                        Logout
                    </Link>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}