import { CircleX, MenuIcon, Trash, Upload } from "lucide-react";
import { Navbar } from "../../Navbar/Navbar";
import { useState } from "react";
import { UserTable } from "./UsersList";
import { useCoordenador } from "@/contexts/coordenadorContext";

export const UserGerence = () => {
  const [openTools, setOpenTools] = useState(false);

  const handleOpenTools = (open: boolean) => {
    setOpenTools(open);

    console.log(open);
  };

  return (
    <div className="">
      <div>
        <UserTable />
      </div>
    </div>
  );
};
