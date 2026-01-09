import { Button } from "../ui/button"
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog"

interface IConfirmation {
    openDialog: boolean
    onOpenDialogChange: (open: boolean) => void
    registerToDelete: string | null
    setRegisterToDelete: React.Dispatch<React.SetStateAction<string | null>>
    deleteRegister: (register: string) => void
}

export const ConfirmationBox = ({
    openDialog,
    onOpenDialogChange,
    registerToDelete,
    setRegisterToDelete,
    deleteRegister
}: IConfirmation) => {
    return (
        <Dialog open={openDialog} onOpenChange={onOpenDialogChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Confirmar exclusão</DialogTitle>
                </DialogHeader>

                <p>Tem certeza que deseja excluir este registro?</p>

                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline" className="cursor-pointer">Cancelar</Button>
                    </DialogClose>

                    <Button
                        className="cursor-pointer"
                        variant="destructive"
                        onClick={() => {
                            if (registerToDelete) {
                                deleteRegister(registerToDelete)
                                setRegisterToDelete(null)
                                onOpenDialogChange(false)
                            }
                        }}
                    >
                        Excluir
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}