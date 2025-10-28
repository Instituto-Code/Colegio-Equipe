import { useAuth } from "@/contexts/authContext"
import { Button } from "../ui/button"
import img_logo from "../../assets/Images/Logo-Equipe.png"
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar"
import { Dropdown } from "../Dropdown/Dropdown"
import { useLocation } from "react-router-dom"
import { MenuItems } from "@/configs/MenuItems"
export const Navbar = () => {

    const { user, logout } = useAuth()

    function capitalizeFirstLetter(str:string | undefined) {
        if (!str) return "";
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    return (
        <div className="flex fixed w-full justify-between items-center bg-indigo-200 py-2 shadow-md z-1">
            <div>
                <img src={img_logo} className="w-[5vw] max-sm:w-15" alt="" />
            </div>

            <span className="text-3xl max-sm:text-[4vw] ">{capitalizeFirstLetter(user?.role)}</span>

            {/* Avatar para Computador */}
            <div className="flex justify-center items-center mr-10 ">
                <Dropdown logout={logout} name={user?.name} />
            </div>

            

        </div>
    )
}