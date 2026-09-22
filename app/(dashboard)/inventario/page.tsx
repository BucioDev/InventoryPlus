import { isLoggedIn } from "@/app/actions"
import TablaProductos from "@/app/components/dashboard/TablaProductos";

export default async function InventarioPage() {

  const session = await isLoggedIn();
  const role = session.role as string;

  return(
    <div>
      {role === "admin" || role === "vendor" ? (
        <>
        <TablaProductos role={role} local={session.location as string}/>
        </>
      ): (
        <div className="flex items-center justify-between mt-5">
          <p className="text-xl text-red-500">No tienes permisos para ver esta pagina</p>
        </div>
      )

      }
    </div>
  ) 
}