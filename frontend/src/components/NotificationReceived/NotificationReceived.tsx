import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { useAuth } from "@/contexts/authContext"
import { Bell, User } from "lucide-react"
import { useState } from "react"
import { DropdownMenuItem } from "../ui/dropdown-menu"

export function NotificationReceived() {
  const { notesGroup, notesUser } = useAuth()
  const [open, setOpen] = useState(false)

  console.log(notesGroup)
  console.log(notesUser)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <DropdownMenuItem
              className="hover:bg-gray-100 p-2 rounded cursor-pointer text-[15px]"
              onSelect={(e) => {
                e.preventDefault();
                setOpen(true)
              }}
            >
              <Bell />
              Notificações
            </DropdownMenuItem>
      </SheetTrigger>

      <SheetContent>
        <SheetHeader>
          <SheetTitle>Mensagens recebidas</SheetTitle>
        </SheetHeader>

        <div className="grid gap-4 mt-4 px-2">
          {notesGroup && notesGroup?.length > 0 ? (
            notesGroup.map((n) => (
              <div
                key={n.id}
                className="flex items-start gap-3 border-b pb-3"
              >
                <User className="w-6 h-6 text-blue-500 mt-1" />
                <div className="flex flex-col">
                  <span className="font-semibold text-sm">
                    {n.author.nome ?? "Autor desconhecido"}
                  </span>
                  <span className="text-sm text-gray-600">
                    {n.conteudo}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500">Nenhuma notificação encontrada</p>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
