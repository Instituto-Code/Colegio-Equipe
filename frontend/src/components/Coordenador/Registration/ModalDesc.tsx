import { Button } from "@/components/ui/button"
import {
    DialogClose,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Spinner } from "@/components/ui/spinner"
import { useCoordenador } from "@/contexts/coordenadorContext"
import { cn } from "@/lib/utils"
import { useForm } from "react-hook-form"
import { toast, Toaster } from "sonner"

export const Modal = () => {

    const { registerStudent, loading } = useCoordenador()

    const currentYear = new Date().getFullYear()

    //Inteface do Aluno
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<IAluno>({
        defaultValues: {
            nome: "",
            matricula: "",
            cpf: "",
            dataNasc: currentYear,
            sexo: "masculino"
        }
    })

    interface IAluno {
        nome: string
        matricula: string
        cpf: string,
        dataNasc: number
        sexo: "masculino" | "feminino"
    }

    const onSubmit = async (data: IAluno) => {
        try {
            await registerStudent(data.nome, data.matricula, data.cpf, data.dataNasc, data.sexo)
            toast.success("Aluno matriculado com sucesso")
        }
        catch (error) {
            toast.error("Erro ao matricular o aluno")
        }
    }


    return (
        
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex w-full flex-col gap-[3vb] max-md:w-4/5">
              
            {/* Campo nome */}
            <div className="flex flex-col gap-2">
                <label htmlFor="nome">
                    Nome
                </label>
                <Input
                    id="nome"
                    type="text"
                    placeholder="Ex: José da Silva"
                    className={cn(
                        errors.nome
                            ? "border-red-500 focus-visible:ring-red-500 "
                            : "border-gray-300 "
                    )}
                    {...register("nome", {
                        required: "o nome é obrigatório"
                    })}
                />
                {errors.nome && (
                    <span className="text-sm text-red-500">
                        {errors.nome.message}
                    </span>
                )}
            </div>

            {/* Campo matrícula */}
            <div className="flex flex-col gap-2">
                <label htmlFor="matricula">
                    Matrícula
                </label>
                <Input
                    id="matricula"
                    type="text"
                    placeholder="Ex: 20252201"
                    className={cn(
                        errors.matricula
                            ? "border-red-500 focus-visible:ring-red-500 "
                            : "border-gray-300 "
                    )}
                    {...register("matricula", {
                        required: "a matricula é obrigatória"
                    })}
                />
                {errors.nome && (
                    <span className="text-sm text-red-500">
                        {errors.matricula?.message}
                    </span>
                )}
            </div>

            {/* Campo Cpf */}
            <div className="flex flex-col gap-2">
                <label htmlFor="cpf">
                    CPF
                </label>
                <Input
                    id="cpf"
                    type="text"
                    placeholder="Ex: 111.111.111-11"
                    className={cn(
                        errors.cpf
                            ? "border-red-500 focus-visible:ring-red-500 "
                            : "border-gray-300 "
                    )}
                    {...register("cpf", {
                        required: "a matricula é obrigatória"
                    })}
                />
                {errors.nome && (
                    <span className="text-sm text-red-500">
                        {errors.cpf?.message}
                    </span>
                )}
            </div>

            {/* Campo data de nascimento */}
            <div className="flex flex-col gap-2">
                <label htmlFor="dataNasc">
                    Data de Nascimento
                </label>
                <Input
                    id="dataNasc"
                    type="date"
                    defaultValue={currentYear}
                    className={cn(
                        errors.cpf
                            ? "border-red-500 focus-visible:ring-red-500 "
                            : "border-gray-300 "
                    )}
                    {...register("dataNasc", {
                        required: "a data de nascimento é obrigatória"
                    })}
                />
                {errors.nome && (
                    <span className="text-sm text-red-500">
                        {errors.dataNasc?.message}
                    </span>
                )}
            </div>

            {/* Campo sexo */}
            <div className="flex flex-col gap-2">
                <label htmlFor="sexo">
                    Sexo
                </label>
                <Select>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Selecione o sexo" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectLabel>Fruits</SelectLabel>
                            <SelectItem value="masculino">Masculino</SelectItem>
                            <SelectItem value="feminino">Feminino</SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>
                {errors.nome && (
                    <span className="text-sm text-red-500">
                        {errors.sexo?.message}
                    </span>
                )}
            </div>

            {/* Botão de envio */}
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
                    "Criar Matrícula"
                )}
            </Button>
        </form>
    )
}