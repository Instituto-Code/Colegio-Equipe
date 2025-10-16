import { Navigate } from "react-router-dom"
import { useAuth } from "@/contexts/authContext"
import { Spinner } from "../ui/spinner"

interface IPrivateRouter {
    children: React.ReactNode;
    roles?: string[]
}


export const PrivateRouter = ({ children, roles }: IPrivateRouter) => {

    const { user, token, loading } = useAuth()

    if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner className="size-8 text-red-500" />
      </div>
    );
  }

    if(!token){
        return <Navigate to={"/login"} replace />
    }

    // Usuário autenticado mas sem role permitida
    if (roles && !roles.includes(user?.role ?? "")) {
        return <Navigate to="/" />;
    }

    return(
        <>{children}</>
    )
}