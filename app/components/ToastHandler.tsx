"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useRef } from "react"
import { toast } from "sonner"

export function ToastHandler() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const hasShown = useRef(false);

  useEffect(() => {
    {/* Remember to add the action and entity to the search params */}
    if (hasShown.current) return // prevent duplicate toasts
    const action = searchParams.get("action") // created | updated | deleted
    const entity = searchParams.get("entity") // Usuario | categoria | producto 

    if (!action || !entity) return

    let message = ""

    switch (action) {
      case "created":
        message = `${capitalize(entity)} creado correctamente`
        break
      case "updated":
        message = `${capitalize(entity)} actualizado correctamente`
        break
      case "deleted":
        message = `${capitalize(entity)} eliminado correctamente`
        break
      default:
        message = "Acción completada"
    }

    toast.success(message)
    hasShown.current = true

    // Remove params from the URL to prevent duplicate toasts in case the user refreshes the page
    const newUrl = window.location.pathname
    router.replace(newUrl)
  }, [searchParams]);

  return null
};


function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1)
};
