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

// Tela para cadastro de usuário.
export const SiginUser = () =>{
    // Estados dos campos do formulário.
    const [name, setNome] = useState("")    
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")    
    const [confirmPass, setConfirmPass] = useState("")
    const navigate = useNavigate()

    const { register, loading, success, errorsRegister } = useAuth()

    //Enviando formulário de Registro
    const handleRegister = async (e: React.FormEvent<HTMLFormElement>)=>{
        e.preventDefault()

        const resposta = await register(name,email,password,confirmPass)

        setNome("")
        setEmail("")
        setPassword("")
        setConfirmPass("")

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
                {success && <p className="text-green-600 font-bold">{success}</p>}

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

                <form onSubmit={handleRegister} id="form_login" className="flex flex-col w-1/2 gap-[3vb] max-md:w-4/5">
                    <InputAuth title={'Nome'} placeHolder={'Ex: João'} type={'text'} name={'nome'} value={name} onChange={(e) => setNome(e.target.value)} />

                    <InputAuth title={'Email'} placeHolder={'Ex: joaozin@gmail.com'} name={'email'} value={email} onChange={(e) => setEmail(e.target.value)} />

                    <InputAuth title={'Senha'} type={'password'} name={'password'} value={password} onChange={(e) => setPassword(e.target.value)} />

                    <InputAuth title={'Confirme a senha'} type={'password'} name={'confirmPass'} value={confirmPass} onChange={(e) => setConfirmPass(e.target.value)} />

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