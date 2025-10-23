import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface User {
  nome?: string;
  email?: string;
  role?: string;
}

export function Tools({ nome, role }: User) {
  const roles: string[] = [
    "coordenador",
    "professor",
    "responsavel",
    "aluno",
    "pendente",
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">Editar</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 z-50" align="start">
        <DropdownMenuLabel className="font-bold">
          {nome} - {role}
        </DropdownMenuLabel>
        <DropdownMenuGroup>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>Editar role</DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                {roles
                  .filter((r) => r !== role)
                  .map((r, index) => (
                    <DropdownMenuItem key={index}>{r}</DropdownMenuItem>
                  ))}
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
