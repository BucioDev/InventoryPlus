import { isLoggedIn } from "../actions";



export default async function Dashboard() {
    const session = await isLoggedIn();

    return (
        <div>
            <h1>Bienvenido a ControlPlus {session.userName}</h1>
        </div>
    )
}
