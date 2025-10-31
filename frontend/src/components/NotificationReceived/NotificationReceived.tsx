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
import { useEffect, useState } from "react"

export function NotificationReceived() {
  const { notes, listNoteToPending } = useAuth()
  const [open, setOpen] = useState(false)





  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          className="flex justify-start items-start gap-2 cursor-pointer"
          onClick={() => setOpen(true)}
        >
          <Bell className="w-5 h-5" />
          Notificações
        </Button>
      </SheetTrigger>

      <SheetContent>
        <SheetHeader>
          <SheetTitle>Mensagens recebidas</SheetTitle>
        </SheetHeader>

        <div className="grid gap-4 mt-4 px-2">
          {notes && notes?.length > 0 && notes.length > 0 ? (
            notes.map((n) => (
              <div
                key={n._id}
                className="flex items-start gap-3 border-b pb-3"
              >
                <User className="w-6 h-6 text-blue-500 mt-1" />
                <div className="flex flex-col">
                  <span className="font-semibold text-sm">
                    {n.author?.name ?? "Autor desconhecido"}
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
