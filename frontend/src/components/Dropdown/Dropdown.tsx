import { Link } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  Bell,
  LogOutIcon,
  Settings,
  User2,
} from "lucide-react";
import { useState } from "react";
import { NotificationsSend } from "../Coordenador/NotificationsSend/NotificationsSend";
import { useAuth } from "@/contexts/authContext";
import { NotificationReceived } from "../NotificationReceived/NotificationReceived";


interface IDropdownProps {
  name?: string;
  role?: string;
  logout: React.MouseEventHandler<HTMLDivElement>;
  imageUrl?: string;
  pathname?: "coordenador";
}

//imageUrl é a foto de perfil, como não tem vai a inicial
export const Dropdown = ({
  name,
  role,
  logout,
  imageUrl,
  pathname,
}: IDropdownProps) => {
  const roleLinks: Record<string, { label: string; href: string }> = {
    coordenador: { label: "Página do Coordenador", href: "/coordenador" },
    responsavel: { label: "Meus Filhos", href: "/responsavel" },
    professor: { label: "Página do Professor", href: "/professor" },
  };

  const [openNotes, setOpenNotes] = useState(false);

  const userLink = role ? roleLinks[role] : undefined;
  const initial = name?.charAt(0).toUpperCase() || "?";

  const { user } = useAuth();

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="flex items-center rounded-full gap-2 px-3 cursor-pointer"
          >
            <Avatar className="w-9 h-9">
              <AvatarImage src={imageUrl} alt={name} />
              <AvatarFallback>{initial}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="end"
          className="flex flex-col gap-2 bg-white mr-1.5 shadow-[0_0px_6px_rgba(0,0,0,0.4)] rounded z-50 min-w-[220px]"
        >
          {userLink && (
            <DropdownMenuItem className="hover:bg-gray-100 p-2 rounded text-[15px]">
              <Link
                to={userLink.href}
                className="w-full flex items-center gap-1.5"
              >
                <User2 />
                {userLink.label}
              </Link>
            </DropdownMenuItem>
          )}

          {pathname && <DropdownMenuItem></DropdownMenuItem>}

          {user?.role === "coordenador" ? (
            <DropdownMenuItem
              className="hover:bg-gray-100 p-2 rounded cursor-pointer text-[15px]"
              onClick={(e) => {
                e.stopPropagation();
                setOpenNotes(true);
              }}
            >
              <Bell />
              Notificações
            </DropdownMenuItem>
          ) : (
            <NotificationReceived />
          )}

          <DropdownMenuItem className="hover:bg-gray-100 p-2 rounded text-[15px]">
            <Link
              to="/settings"
              className="w-full flex items-center gap-1.5"
            >
              <Settings />
              Configurações
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={logout}
            className="bg-white hover:text-red-400 text-red-400 cursor-pointer p-2 rounded text-[15px]"
          >
            <LogOutIcon />
            Sair
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <NotificationsSend open={openNotes} onOpenChange={setOpenNotes} />
    </>
  );
};
