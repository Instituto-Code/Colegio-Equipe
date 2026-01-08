import { IoArrowBack } from "react-icons/io5"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Link } from "react-router-dom"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { useForm } from "react-hook-form"
import { useEffect, useState } from "react"
import { useAuth } from "@/contexts/authContext"
import { api_url } from "@/contexts/coordenadorContext"
import { Spinner } from "../ui/spinner"
import { toast } from "sonner"

interface IAdress {
    rua: string;
    numero: string
}

type FormData = {
    _id: string;
    name: string;
    email: string;
    cpf?: string;
    dataNasc?: string;
    numberTel: string;
    adress: IAdress;
    role?: string;
    password?: string;
    confirmPass?: string;
}

export const Configuracoes = () => {

    const { token, user } = useAuth()

    const { register, handleSubmit, setValue, reset } = useForm<FormData>()
    const [usuario, setUsuario] = useState<FormData | null>(null)
    const [loading, setLoading] = useState(false)
    const [isEditing, setIsEditing] = useState(false)

    useEffect(() => {
        if (user) {
            reset(user)
        }
    }, [user, reset])


    const onSubmit = async (data: FormData) => {
        setLoading(true)
        try {
            const res = await fetch(`${api_url}/api/users/edit-profile`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(data)
            })

            const dataJson = await res.json()

            if (!res.ok) {
                toast.error("Erro ao mudar dados")
                console.error(dataJson)
            }

            console.log(dataJson)
            setUsuario(dataJson)
            toast.success("Mudança salva com sucesso")
        }
        catch (error) {
            console.error(error)
        }
        finally {
            setLoading(false)
        }
        console.log("enviou os dados")
    }

    return (
        <div className="flex flex-col w-full h-screen ">

            <div className=" flex items-center text-2xl font-semibold pl-3 py-4 mb-5 bg-indigo-200 sm:pl-5">
                <Link to="/">
                    <IoArrowBack />
                </Link>

                <h1 className="ml-5 sm:ml-10 ">
                    Configurações do usuário
                </h1>
            </div>

            <div className="flex flex-col-reverse w-full justify-around sm:flex-row">
                <div className="flex flex-col ">
                    <div className="my-5 pl-10">
                        <Label className="text-[1.5rem]">Seus dados</Label>
                    </div>
                    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col w-full px-10 gap-5 mb-10 sm:w-[45em] ">
                        <div className="flex flex-col gap-3">
                            <Label htmlFor="nome">Nome</Label>
                            <Input
                                {...register("name")}
                                disabled={!isEditing}
                                id="nome"

                            />
                        </div>

                        <div className="flex flex-col gap-3">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                {...register("email")}
                                disabled={!isEditing}
                                id="email"
                                type="email"
                            />
                        </div>

                        <div className="flex flex-col gap-3">
                            <Label htmlFor="cpf">CPF</Label>
                            <Input
                                {...register("cpf")}
                                disabled={!isEditing}
                                id="cpf"
                                type="text"
                            />
                        </div>

                        <div className="flex flex-col gap-3">
                            <Label htmlFor="telefone">Telefone</Label>
                            <Input
                                {...register("numberTel")}
                                disabled={!isEditing}
                                id="telefone"
                            />
                        </div>

                        <div className="flex flex-col gap-3">
                            <Label htmlFor="endereco">Endereço</Label>
                            <Input
                                {...register("adress.rua")}
                                disabled={!isEditing}
                                id="endereco"
                                type="text"
                            />
                        </div>


                        <Button
                            type={isEditing ? "button" : "submit"}
                            onClick={() => {
                                if (!isEditing) {
                                    return setIsEditing(true);
                                }
                                setIsEditing(false)
                            }}

                        >
                            {loading
                                ? (
                                    <span className="flex gap-1.5 items-center">
                                        <Spinner /> Carregando
                                    </span>
                                ) : isEditing ? "Salvar Alterações" : "Editar"
                            }

                        </Button>
                    </form>
                </div>


                <div className="flex flex-col h-full items-center">
                    <Label>Imagem de Perfil</Label>
                    <div className="flex flex-row flex-wrap items-center gap-12 mt-5 ">
                        <Avatar>
                            <AvatarImage className="w-[10em]" src="https://github.com/shadcn.png" />
                            <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                    </div>

                    <div className="mt-3">
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button variant="outline">Editar Foto</Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-50">
                                <div className="flex flex-col gap-4">
                                    <Button variant="outline">
                                        Alterar Foto
                                    </Button>
                                    <Button variant="outline">
                                        Remover Foto
                                    </Button>
                                </div>

                            </PopoverContent>
                        </Popover>
                    </div>

                </div>
            </div>

        </div>
    )
}