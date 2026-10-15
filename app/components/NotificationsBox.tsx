
"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BellIcon } from "lucide-react";
import { MarkAsRead } from "../actions";
import { useCallback, useEffect, useRef, useState } from "react";

type Notificacion = {
  id: string;
  message: string;
  read: boolean;
};

const POLL_INTERVAL = 30_000;
const CHANNEL_NAME = "notifications";
const LOCK_NAME = "notification-polling";

export default function NotificationBox() {
  const [notificaciones, setNotificaciones] = useState<Notificacion[]>([]);
  const channelRef = useRef<BroadcastChannel | null>(null);

  const markAsRead = async (formData: FormData) => {
    await MarkAsRead(formData);
    channelRef.current?.postMessage({ type: "refresh" });
  };

  useEffect(() => {
    let active = true;
    let isLeader = false;
    let latestData: Notificacion[] = [];
    let refreshRequested = false;

    const channel = new BroadcastChannel(CHANNEL_NAME);
    channelRef.current = channel;

    const publish = (data: Notificacion[]) => {
      if (!active) return;

      latestData = data;
      setNotificaciones(data);
      channel.postMessage({ type: "notifications", data });
    };

    const fetchNotifications = async () => {
      try {
        const response = await fetch("/api/notificaciones", {
          cache: "no-store",
        });

        if (!response.ok) return;

        const data: Notificacion[] = await response.json();
        publish(data);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    channel.onmessage = (event) => {
      const { type, data } = event.data ?? {};

      if (type === "notifications" && Array.isArray(data)) {
        latestData = data;
        setNotificaciones(data);
      }

      if (type === "request" && isLeader && latestData.length >= 0) {
        channel.postMessage({
          type: "notifications",
          data: latestData,
        });
      }

      if (type === "refresh" && isLeader) {
        refreshRequested = true;
      }
    };

    const onVisibilityChange = () => {
      if (active && isLeader && document.visibilityState === "visible") {
        refreshRequested = true;
      }
    };

    document.addEventListener("visibilitychange", onVisibilityChange);

    channel.postMessage({ type: "request" });

    const runPolling = async () => {
      isLeader = true;

      try {
        await fetchNotifications();

        while (active) {
          await new Promise<void>((resolve) => {
            const check = () => {
              if (!active) {
                resolve();
                return;
              }

              if (refreshRequested) {
                refreshRequested = false;
                resolve();
                return;
              }

              setTimeout(check, 250);
            };

            setTimeout(resolve, POLL_INTERVAL);
            check();
          });

          if (!active) break;
          await fetchNotifications();
        }
      } finally {
        isLeader = false;
      }
    };

    if ("locks" in navigator) {
      navigator.locks.request(
        LOCK_NAME,
        { mode: "exclusive" },
        async () => {
          if (active) await runPolling();
        }
      ).catch((error) => {
        console.error("Notification lock failed:", error);
      });
    } else {
      // Fallback for browsers without Web Locks.
      void runPolling();
    }

    return () => {
      active = false;
      document.removeEventListener("visibilitychange", onVisibilityChange);
      channel.close();
      channelRef.current = null;
    };
  }, []);

  const unreadCount = notificaciones.filter((n) => !n.read).length;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button>
          {unreadCount}
          <BellIcon />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent>
        <DropdownMenuLabel>Notificaciones</DropdownMenuLabel>
        <DropdownMenuSeparator />

        {notificaciones.map((notification) => (
          <DropdownMenuItem key={notification.id} className="flex justify-between">
            <span>{notification.message}</span>

            <form action={markAsRead}>
              <input type="hidden" name="id" value={notification.id} />
              {notification.read ? (
                <p className="font-bold">Leído</p>
              ) : (
                <Button type="submit" variant="link" className="p-0 h-auto text-blue-500">
                  Marcar como leído
                </Button>
              )}
            </form>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
