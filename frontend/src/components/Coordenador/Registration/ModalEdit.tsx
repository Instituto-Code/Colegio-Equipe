import { Dialog, DialogContent,DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
// import { Dialog, DialogContent } from "@radix-ui/react-dialog"
import type { IconBaseProps } from "react-icons/lib"

interface IModalEdit {
    onClose: () => void
}

export const ModalEdit = ({
    onClose
}: IModalEdit) => {

    return (
        
            <Dialog open={true} onOpenChange={onClose}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Are you absolutely sure?</DialogTitle>
                        <DialogDescription>
                            This action cannot be undone. This will permanently delete your account
                            and remove your data from our servers.
                        </DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        
    )
}