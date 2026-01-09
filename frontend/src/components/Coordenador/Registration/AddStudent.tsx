import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Modal } from "./ModalDesc"

export const AddStudent = () => {
    return (
        <Dialog>
            <form>
                <DialogTrigger asChild>
                    <Button variant={"outline"}
                        className="cursor-pointer my-3.5 md:my-0 bg-blue-400 text-white hover:bg-blue-500 hover:text-white">
                        Adicionar
                    </Button>
                </DialogTrigger>
                <DialogContent className="">
                    <DialogTitle>Adicione um novo Aluno</DialogTitle>
                    <DialogDescription>Informe aqui os dados referentes ao aluno!</DialogDescription>
                    <Modal />
                </DialogContent>
            </form>
        </Dialog>
    )
}