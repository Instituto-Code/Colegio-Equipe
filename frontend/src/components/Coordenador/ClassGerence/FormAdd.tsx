import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { useCoordenador } from "@/contexts/coordenadorContext";
import { cn } from "@/lib/utils";
import { Calendar, Clock, School } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

//Interface do formulário
interface IAddForm {
    nome: string;
    turno: string;
    anoLetivo: number
}

export const FormAdd = () => {

    const { registerClasses, loading } = useCoordenador();

    const currentYear = new Date().getFullYear();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<IAddForm>({
        defaultValues: {
            nome: "",
            turno: "",
            anoLetivo: currentYear,
        },
    });

    //Enviando os dados para o backend
    const onSubmit = async (data: IAddForm) => {
        await registerClasses(data.nome, data.turno.toLocaleLowerCase(), data.anoLetivo);
        toast(`Turma: "${data.nome}", criada com sucesso.`);
    }

    return(
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex w-full flex-col gap-[3vb] max-md:w-4/5"
        >
          {/* Campo nome */}
          <div className="flex flex-col gap-1">
            <label htmlFor="nome" className="font-medium text-sm">
              Nome
            </label>

            <div className="relative">
              <Input
                id="nome"
                type="text"
                placeholder="Nome da turma, ex: 1º ano A"
                className={cn(
                  errors.nome
                    ? "border-red-500 focus-visible:ring-red-500 pl-10"
                    : "border-gray-300 pl-10"
                )}
                {...register("nome", {
                  required: "O nome é obrigatório"
                })}
              />
              <School className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>

            {errors.nome && (
              <span className="text-sm text-red-500">
                {errors.nome.message}
              </span>
            )}
          </div>

          {/* Campo turno */}
          <div className="flex flex-col gap-1">
            <label htmlFor="turno" className="font-medium text-sm">
              Turno
            </label>
            <div className="relative">
              <Input
                id="turno"
                type="text"
                placeholder="Turno, ex: Manhã"
                className={cn(
                  errors.turno
                    ? "border-red-500 focus-visible:ring-red-500 pl-10"
                    : "border-gray-300 pl-10"
                )}
                {...register("turno", {
                  required: "O turno é obrigatório"
                })}
              />
              <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>

            {errors.turno && (
              <span className="text-sm text-red-500">
                {errors.turno.message}
              </span>
            )}
          </div>

          {/* Campo ano letivo */}
          <div className="flex flex-col gap-1">
            <label htmlFor="ano" className="font-medium text-sm">
              Ano letivo
            </label>
            <div className="relative">
              <Input
                id="ano"
                type="number"
                placeholder="Ano letivo, ex: 2025"
                className={cn(
                  errors.anoLetivo
                    ? "border-red-500 focus-visible:ring-red-500 pl-10"
                    : "border-gray-300 pl-10"
                )}
                {...register("anoLetivo", {
                  required: "O ano letivo é obrigatório",
                  min: {
                    value: currentYear,
                    message: `O ano letivo não pode ser menor que o ano atual (${currentYear})`,
                }
                })}
              />
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>

            {errors.anoLetivo && (
              <span className="text-sm text-red-500">
                {errors.anoLetivo.message}
              </span>
            )}
          </div>

          <Button
            disabled={loading}
            type="submit"
            className="bg-blue-400 text-white hover:text-white hover:bg-blue-500 cursor-pointer"
          >
            {loading ? (
              <span className="flex gap-1.5 items-center">
                <Spinner /> Criando turma...
              </span>
            ) : (
              "Criar turma"
            )}
          </Button>
        </form>
    )
}

