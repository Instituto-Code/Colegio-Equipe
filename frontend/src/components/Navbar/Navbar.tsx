import { useAuth } from "@/contexts/authContext"
import { Button } from "../ui/button"

export const Navbar = () => {

    const { user, logout } = useAuth()

    return(
        <div className="flex flex-col w-full">
            <span className="text-[clamp(3vw,3.5vw,10vw)] text-center" >Coordenador</span>
            <hr className="flex border-[0.3vw] border-[#8C8CF4] my-[2vw]"></hr>
            <div className="flex justify-between px-5 items-center text-[2vw] max-sm:text-[3.5vw] max-lg:text-[2.3vw] max-sm:px-1 ">
                <div>
                    <span className="text-[#F20519]">Colégio </span><span className="text-[#040FD9]">Equipe</span>
                    </div>
                <span>{user?.name}</span>
                <Button className="flex w-60 h-18 max-sm:w-18 max-sm:h-8 max-lg:w-30 max-lg:h-15 bg-red-600 text-center text-[2vw] max-sm:text-[4vw] " onClick={logout}>Sair</Button>
            </div>
        </div>
    )
}