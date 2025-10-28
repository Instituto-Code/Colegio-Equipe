import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { FormAdd } from "./FormAdd"

export function AddClass() {
  return (
    <Dialog>
      <form>
        <DialogTrigger asChild>
          <Button variant="outline" 
          className="cursor-pointer my-3.5 md:my-0 bg-blue-400 text-white hover:bg-blue-500 hover:text-white">
            Criar Turma
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Criar nova turma</DialogTitle>
            <DialogDescription>
              Preencha os dados da nova turma.
            </DialogDescription>
          </DialogHeader>
            <FormAdd />
        </DialogContent>
      </form>
    </Dialog>
  )
}



