import { CircleX, MenuIcon, Trash, Upload } from "lucide-react";
import { Navbar } from "../../Navbar/Navbar";
import { useState } from "react";
import { UserTable } from "./UsersList";

export const UserGerence = () => {
  const [openTools, setOpenTools] = useState(false);

  const handleOpenTools = (open: boolean) => {
    setOpenTools(open);

    console.log(open);
  };

  const usuarios = 23;

  return (
    <div className="flex flex-col px-4 h-full">
      {/* Cabeçalho */}
      <Navbar />

      {/* Menu de ferramentas */}
      <div className="flex-col w-full mt-5 md:flex-row">
        <span className="flex md:hidden w-full justify-center">
          {openTools ? (
            <CircleX color="red" onClick={() => handleOpenTools(!openTools)} />
          ) : (
            <MenuIcon onClick={() => handleOpenTools(!openTools)} />
          )}
        </span>

        <div
          className={`md:flex w-full justify-around 
            ${
              openTools
                ? "flex mt-1.5 flex-col gap-5 justify-center rounded-2xl border-1 p-3"
                : "hidden"
            }`}
        >
          <span>Usuarios {usuarios}</span>
          <button className="flex text-blue-600 cursor-pointer gap-1">
            <Upload />
            <span>IMPORTAR USUÁRIOS</span>
          </button>
          <button className="flex text-red-600 cursor-pointer gap-1">
            <Trash />
            <span>Excluir</span>
          </button>
        </div>
      </div>

      <div className="mt-5">
        <UserTable />
      </div>
    </div>
  );
};
