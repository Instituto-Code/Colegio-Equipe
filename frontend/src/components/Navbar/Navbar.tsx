import { useAuth } from "@/contexts/authContext"
import { Button } from "../ui/button"

export const Navbar = () => {

    const { user, logout } = useAuth()

    return(
        <div className="flex flex-col w-full">
            <span className="text-[clamp(1vw,4vw,10vw)] text-center" >Coordenador</span>
            <hr className="flex border-4 border-[#8C8CF4] my-10"></hr>
            <div className="flex justify-between px-5 items-center">
                <div>
                    <span className="text-[#F20519]">Colégio </span><span className="text-[#040FD9]">Equipe</span>
                    </div>
                <span>{user?.name}</span>
                <Button onClick={logout}>Sair</Button>
            </div>
        </div>
    )
}