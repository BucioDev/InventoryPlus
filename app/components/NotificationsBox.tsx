"use client"
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { read } from "fs";
import { BellIcon } from "lucide-react";
import { MarkAsRead } from "../actions";
import { useEffect, useState } from "react";
import { no } from "zod/v4/locales";


type notificaciones = {
    id:string;  
    message:string;
    read:boolean;
}

export default function NotificationBox(){
    const [notificiaciones, setNotificaciones] = useState<notificaciones[]>([]);

    useEffect(() => {
        let active = true;
      
        const fetchNotifications = async () => {
          const res = await fetch("/api/notificaciones");
          const data: notificaciones[] = await res.json();
          if (active) setNotificaciones(data);
        };
      
        fetchNotifications(); 
        const interval = setInterval(fetchNotifications, 5000); 
      
        return () => {
          active = false;
          clearInterval(interval);
        };
      }, []);

        const unreadCount = notificiaciones.filter((n) => !n.read).length;

    return(
        <>
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button>
                    {unreadCount}
                    <BellIcon/>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuLabel>
                    Notificaciones
                </DropdownMenuLabel>
                <DropdownMenuSeparator/>
                {notificiaciones.map((notification) => (
          <DropdownMenuItem key={notification.id} className="flex justify-between">
            <span>
              {notification.message} — 
            </span>

            <form action={MarkAsRead}>
              <input type="hidden" name="id" value={notification.id} />
              {notification.read ? (
                 <p className="font-bold">Leido</p>
              ):( 
                <Button type="submit" variant="link" className="p-0 h-auto text-blue-500">
                Marcar como leído
              </Button>
              )}
            </form>
          </DropdownMenuItem>
        ))}
            </DropdownMenuContent>
        </DropdownMenu>
        </>
    )
}