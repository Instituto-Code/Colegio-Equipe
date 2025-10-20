import { Trash, Upload } from "lucide-react"
import { Navbar } from "../Navbar/Navbar"
 

export const UserGerence = () => {
    
    const usuarios = 23

    return(
        <div className="flex flex-col items-center justify-around px-4 h-full">
            <Navbar/>
            <div className="flex w-full">
                <div className="flex w-full justify-around">
                    <span>Usuarios {usuarios}</span>
                    <button className="flex text-blue-600 cursor-pointer gap-1">
                        <Upload/>
                        <span>IMPORTAR USUÁRIOS</span>
                    </button>
                    <button className="flex text-red-600 cursor-pointer gap-1">
                        <Trash/>
                        <span>Excluir</span>
                    </button>
                </div>
            </div>
        </div>
    )
}