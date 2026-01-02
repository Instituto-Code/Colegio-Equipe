import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Check, ChevronsUpDown, MoreHorizontalIcon, Pen } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { api_url, useCoordenador } from "@/contexts/coordenadorContext";
import { useAuth } from "@/contexts/authContext";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

// Interface para as props
interface IModalEdit {
  nome: string;
  idAluno: string;
  openDialog: boolean;
}

// Interface para o parente
interface IParent {
  email: string;
  endereco: object;
  filhos: [];
  id: string;
  nome: string;
}

export const MenuParents = ({
  // openDialog,
  nome,
  idAluno,
}: IModalEdit) => {
  const [showNewDialog, setShowNewDialog] = useState(false);
  const [parents, setParents] = useState<IParent[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const { token } = useAuth();

  const { relationParentStudent } = useCoordenador();

  // Carregamento da lista com todos os pais.
  useEffect(() => {
    // Caso o popover no esteja aberto retorna.
    if (!showNewDialog) return;

    // Carrega ao abrir o popover.
    const getParents = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${api_url}/api/coordenador/list-parents`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        setParents(data.responsaveis);
        setLoading(false);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    getParents();
  }, [showNewDialog]);

  // Interface para u
  interface IAssociantion {
    parente: string;
  }

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<IAssociantion>({
    defaultValues: {
      parente: "",
    },
  });

  // Exibição de toast em caso de sucesso ou de erro
  const onSubmit = async (data: IAssociantion) => {
    setLoading(true);
    try {
      const res = await relationParentStudent(idAluno, data.parente);

      if (res?.msg) {
        toast.success(res.msg);
      } else {
        toast.error(res.error);
      }
    } catch (error) {
      toast.error("Erro na comunicação com o servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button aria-label="Open menu" className="bg-blue-500">
            <Pen />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-40 z-50" align="start">
          <DropdownMenuLabel>{nome}</DropdownMenuLabel>
          <DropdownMenuGroup>
            <DropdownMenuItem onSelect={() => setShowNewDialog(true)}>
              Associar parente
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={showNewDialog} onOpenChange={setShowNewDialog}>
        <DialogContent className="sm:max-w-[500px] ">
          <form onSubmit={handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle className="mb-5">
                Vincular o aluno a um responsável
              </DialogTitle>
              {/* <DialogDescription>Selecione um pai e associe esse aluno a ele!</DialogDescription> */}
              <div className="flex flex-col items-start">
                <FieldLabel className="">Nome do Aluno</FieldLabel>
                <strong className="items-start">{nome}</strong>
              </div>

              <div className="flex flex-col sm:items-start">
                <FieldLabel htmlFor="resposável" className="mb-1 justify-cente">
                  Selecione o responsável
                </FieldLabel>
                <Controller
                  name="parente"
                  control={control}
                  rules={{ required: "Selecione um responsável" }}
                  render={({ field }) => {
                    return (
                      <Popover open={open} onOpenChange={setOpen}>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={open}
                            className="w-[250px] justify-between"
                          >
                            {/* {selectedParent ? selectedParent.nome : "Selecione um usuário..."} */}
                            {field.value
                              ? parents && parents.find(
                                  (parent) => parent.id === field.value
                                )?.nome
                              : "Selecione um Responsável "}
                            <ChevronsUpDown className="opacity-50 h-4 w-4" />
                          </Button>
                        </PopoverTrigger>

                        <PopoverContent className="w-[250px] p-0">
                          <Command>
                            <CommandInput
                              placeholder="Buscar usuário..."
                              value={searchTerm}
                              onValueChange={setSearchTerm}
                            />
                            {loading ? (
                              <CommandEmpty>
                                Buscando Responsáveis...{" "}
                              </CommandEmpty>
                            ) : (
                              <CommandGroup>
                                {parents && parents.length > 0 ? parents
                                  .filter((parent) =>
                                    parent.nome
                                      .toLowerCase()
                                      .includes(searchTerm.toLowerCase())
                                  )
                                  .map((parent) => (
                                    <CommandItem
                                      key={parent.id}
                                      value={parent.id}
                                      onSelect={(value) => {
                                        field.onChange(value);
                                        setOpen(false);
                                      }}
                                    >
                                      <Check
                                        className={cn(
                                          "mr-2 h-4 w-4",
                                          parent.id === field.value
                                            ? "opacity-100"
                                            : "opacity-0"
                                        )}
                                      />
                                      {parent.nome}
                                    </CommandItem>
                                  )): (
                                    <span>Nenhum responsável cadastrado.</span>
                                  )}
                              </CommandGroup>
                            )}
                          </Command>
                        </PopoverContent>
                      </Popover>
                    );
                  }}
                />
                {errors.parente && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.parente.message}
                  </p>
                )}
              </div>
            </DialogHeader>
            <DialogFooter className="mt-5">
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit">Associar</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};
