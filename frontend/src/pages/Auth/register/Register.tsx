import { Link } from 'react-router-dom'

import img_register from '../../../assets/Images/img_auth.png'
import React, { useState } from 'react'
import { useAuth } from '../../../contexts/authContext'

import { InputAuth } from '../../../components/Inputs/Inputs'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'
import { useForm, Watch } from "react-hook-form";
import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'
import { User, Mail, Lock } from "lucide-react";


type RegisterFormData = {
    name: string,
    email: string,
    password: string,
    confirmPass: string
}

// Tela para cadastro de usuário.
export const SiginUser = () =>{
    const navigate = useNavigate()
    const { register, loading, errorsRegister } = useAuth()

    //Configuração do react-hook
    const { 
        register: registerInput, 
        handleSubmit, 
        watch,
        formState: { errors },
    } = useForm <RegisterFormData>({
        defaultValues: {
            name: "",
            email: "",
            password: "",
            confirmPass: ""
        },
    });

    //Submit dos dados
    const onSubmit = async (data: RegisterFormData) => {
        const resposta = await register(data.name, data.email, data.password, data.confirmPass);

        if(resposta){
            setTimeout(() => navigate("/login"), 300)
        }
    }

    return(
         <div className="flex justify-center items-center w-screen max-md:h-screen">
            <div className="flex flex-col items-center justify-center w-1/2 h-full rounded-[10px] max-md:w-full max-md:justify-around max-md:h-full">
                <div className="flex font-medium text-[2em] font-sans text-center mb-[2vh]">
                    Cadastre-se!
                </div> 

                {/* Exibindo mensagens de erro do servidor */}

                {errorsRegister.length > 0 && (
                <Alert variant="destructive" className='border-0 flex flex-col justify-center items-center'>
                    <div className='flex gap-1.5'>
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Erro ao fazer login</AlertTitle>
                    </div>
                    <AlertDescription>
                    <ul className="list-disc list-inside space-y-1 mt-2">
                        {errorsRegister.map((err, index) => (
                        <li key={index}>{err}</li>
                        ))}
                    </ul>
                    </AlertDescription>
                </Alert>
                )}

                {/* Formulário */}
                <form 
                    onSubmit={handleSubmit(onSubmit)} id="form_login" className="flex flex-col w-1/2 gap-[3vb] max-md:w-4/5">
                    
                    {/* Campo de nome de usuário */}
                    <div className="flex flex-col gap-1">
                        <label htmlFor="email" className="font-medium text-sm">
                            Nome
                        </label>
                        <div className='relative'>
                            <Input
                                id="name"
                                type="text"
                                placeholder="Seu nome"
                                className={cn(
                                    errors.name
                                    ? "border-red-500 focus-visible:ring-red-500 pl-10"
                                    : "border-gray-300 pl-10"
                                )}
                                {...registerInput("name", {
                                    required: "O nome é obrigatório",
                                })}
                            />
                            <User className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400' />
                        </div>
                        {errors.name && (
                            <span className="text-sm text-red-500">
                                {errors.name.message}
                            </span>
                        )}
                    </div>
                    
                    {/* Campo de email */}
                    <div className="flex flex-col gap-1">
                        <label htmlFor="email" className="font-medium text-sm">
                            Email
                        </label>
                        <div className='relative'>
                            <Input
                                id="email"
                                type="email"
                                placeholder="Seu E-mail"
                                className={cn(
                                    errors.email
                                    ? "border-red-500 focus-visible:ring-red-500 pl-10"
                                    : "border-gray-300 pl-10"
                                )}
                                {...registerInput("email", {
                                    required: "O e-mail é obrigatório",
                                    pattern: {
                                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                    message: "Digite um e-mail válido",
                                    },
                                })}
                            />
                            <Mail className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400' />
                        </div>
                        {errors.email && (
                            <span className="text-sm text-red-500">
                                {errors.email.message}
                            </span>
                        )}
                    </div>
                    
                    {/* Campo de senha */}
                    <div className="flex flex-col gap-1">
                        <label htmlFor="password" className="font-medium text-sm">
                        Senha
                        </label>
                        <div className='relative'>
                            <Input
                                id="password"
                                type="password"
                                placeholder="Sua senha"
                                className={cn(
                                    errors.password
                                    ? "border-red-500 focus-visible:ring-red-500 pl-10"
                                    : "border-gray-300 pl-10"
                                )}
                                {...registerInput("password", {
                                    required: "A senha é obrigatória",
                                    minLength: {
                                    value: 6,
                                    message: "A senha deve ter pelo menos 6 caracteres",
                                    },
                                })}
                            />
                            <Lock className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400' />
                        </div>

                        {errors.password && (
                            <span className="text-sm text-red-500">
                                {errors.password.message}
                            </span>
                        )}
                       
                    </div>
                    
                    {/* Campo de confirmação de senha */}
                    <div className="flex flex-col gap-1">
                        <label htmlFor="confirmPass" className="font-medium text-sm">
                            Confirme a Senha
                        </label>

                        <div className='relative'>
                            <Input
                                id="confirmPass"
                                type="password"
                                placeholder="Confirme sua senha"
                                className={cn(
                                    errors.confirmPass
                                    ? "border-red-500 focus-visible:ring-red-500 pl-10"
                                    : "border-gray-300 pl-10"
                                )}
                                {...registerInput("confirmPass", {
                                    required: "A confirmação de senha é obrigatória",
                                    validate: (value) => value === watch("password") || "As senhas não conferem"
                                })}
                            />
                            <Lock className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400' />
                        </div>
                        {errors.confirmPass && (
                            <span className="text-sm text-red-500">
                                {errors.confirmPass.message}
                            </span>
                        )}
                        
                    </div>

                    <Button disabled={loading} type='submit' className='bg-[#303A73] hover:bg-[#181f44] cursor-pointer'>
                        {
                            loading ? (
                                <span className='flex gap-1.5 items-center'>
                                    <Spinner />
                                    Carregando
                                </span>
                            ) : (
                                <span>Cadastrar</span>
                            )
                        }
                    </Button>
                </form>

                <div className="mt-[4vh] font-light text-[1rem] font-sans">
                    Já tem uma conta? <Link to="/login" className="font-bold no-underline">Clique aqui</Link>
                </div>
            </div>

            <div className="flex w-1/2 h-screen items-center object-cover max-md:hidden">
                <img src={img_register} alt="" className="flex w-full h-full object-cover bg-center" />
            </div>
        </div>
        )
}