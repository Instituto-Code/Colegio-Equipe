import { useAuth } from "@/contexts/authContext"
import img_logo from "../../assets/Images/Logo-Equipe.png"
import { Dropdown } from "../Dropdown/Dropdown"
import { Link } from "react-router-dom"
export const Navbar = () => {

    const { user, logout } = useAuth()

    function capitalizeFirstLetter(str:string | undefined) {
        if (!str) return "";
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    return (
        <div className="flex sticky z-40 top-0 w-full justify-between items-center bg-indigo-200 py-2 shadow-md z-1">
            <div>
                <Link to={"/"}>
                    <img src={img_logo} className="w-[5vw] max-sm:w-15" alt="" />
                </Link>
            </div>

            <span className="text-3xl max-sm:text-[4vw] ">{capitalizeFirstLetter(user?.role)}</span>

            {/* Avatar para Computador */}
            <div className="flex justify-center items-center">
                <Dropdown logout={logout} name={user?.name} />
            </div>

            

        </div>
    )
}