"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useRef } from "react"
import { toast } from "sonner"

export function ToastHandler() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const lastParams = useRef<string | null>(null)

  useEffect(() => {
    const action = searchParams.get("action") // created | updated | deleted
    const entity = searchParams.get("entity") // usuario | categoria | producto

    if (!action || !entity) return

    // Create a unique key for the current toast
    const paramsKey = `${action}-${entity}`
    if (lastParams.current === paramsKey) return // prevent showing the same toast twice in a row

    lastParams.current = paramsKey

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

    // Clean the URL so it doesn’t re-trigger on refresh
    const newUrl = window.location.pathname
    router.replace(newUrl)
  }, [searchParams, router])

  return null
}

function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}
