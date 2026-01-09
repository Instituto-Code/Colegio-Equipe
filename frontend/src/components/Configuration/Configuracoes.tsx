import { IoArrowBack, IoArrowBackOutline, IoArrowBackSharp } from "react-icons/io5"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Link, useNavigate } from "react-router-dom"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { useForm } from "react-hook-form"
import { useEffect, useRef, useState } from "react"
import { useAuth, type IUser } from "@/contexts/authContext"
import { api_url } from "@/contexts/coordenadorContext"
import { Spinner } from "../ui/spinner"
import { toast } from "sonner"
import { ModeToggle } from "../Theme/mode-toggle"
import { FormAdd } from "../Coordenador/ClassGerence/FormAdd"

// Definição da interface para o endereço
interface IAdress {
    rua: string;
    numero: string
}

// Definição do tipo de dados do formulário
type FormData = {
    _id: string;
    name: string;
    email: string;
    avatarUrl: any;
    cpf?: string;
    dataNasc?: string;
    numberTel: string;
    adress: IAdress;
    role?: string;
    password?: string;
    confirmPass?: string;
}

// Componente de Configurações do Usuário
export const Configuracoes = () => {

    const { token, user } = useAuth()

    const { register, handleSubmit, setValue, reset } = useForm<FormData>()
    const [usuario, setUsuario] = useState<FormData | null>(null)
    const [loading, setLoading] = useState(false)
    const [isEditing, setIsEditing] = useState(false)
    const fileInput = useRef<HTMLInputElement | null>(null)

    const navigate = useNavigate()

    useEffect(() => {
        if (user) {
            reset(user)
        }
    }, [user, reset])

    // Função para enviar dados e alterar os campos do usuário
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

            setUsuario(dataJson)
            toast.success("Mudança salva com sucesso")
        }
        catch (error) {
            console.error(error)
        }
        finally {
            setLoading(false)
        }
    }

    const handleImageChange = async (
        event: React.ChangeEvent<HTMLInputElement>
    ) =>{

        const image = event.target.files?.[0]
        if(!image) return
        
        const formData = new FormData()
        formData.append("avatar", image)

        console.log(formData)

        setLoading(true)

        try{
            const res = await fetch(`${api_url}/api/users/avatar`, {
                method: "PATCH",
                headers:{
                    Authorization: `Bearer ${token}`,
                },
                body: formData
            })

            toast.success("Foto atualizada com sucesso")
        }
        catch(error){
            console.error(error)
        }
        finally{
            setLoading(false)
        }
    }

    return (
        <div className="flex flex-col w-full h-screen ">

            <div className=" bg-navbar-primary flex items-center text-2xl justify-between font-semibold pl-3 py-4 mb-5 sm:pl-5">

                <IoArrowBackSharp className="cursor-pointer" onClick={() => { navigate(-1) }} />

                <h1 className="ml-0 text-xl sm:ml-10 sm:text-2xl ">
                    Configurações do usuário
                </h1>

                <div className="pr-4">
                    <ModeToggle />
                </div>
            </div>

            <div className="flex flex-col-reverse w-full px-5 justify-around sm:flex-row sm:justify-between sm:px-25 md:px-10 lg:px-20">
                <div className="flex flex-col ">
                    <div className="my-5 sm:pl-5 md:pl-0">
                        <Label className="text-[1.5rem]">Seus dados</Label>
                    </div>
                    {/* Formulário de edição de dados do usuário */}
                    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col w-full gap-5 mb-10 sm:w-[45em] md:w-[35em] lg:w-[45em] ">
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

                        {/* Botão de salvar ou editar */}
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

                <div className="flex flex-col h-full items-center pr-10 md:pr-0 xl:pr-15">
                    <Label className="text-[1.5em]">Imagem de Perfil</Label>
                    <div className="flex flex-row flex-wrap items-center gap-12 mt-4 ">
                        <Avatar>
                            <AvatarImage className="w-[10em]" src={user?.avatarUrl} >{}</AvatarImage>
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

                                    <Input
                                        className="hidden"
                                        type="file"
                                        accept="image/*"
                                        ref={fileInput}
                                        onChange={handleImageChange}
                                    />

                                    <Button
                                        variant="outline"
                                        onClick={()=>{
                                            fileInput.current?.click()
                                        }}
                                    >
                                        {loading ? "Enviando..." : "Escolher foto"}
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