import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import img_register from '../../../assets/Images/img_auth.png'

import { InputAuth } from '../../../components/Inputs/Inputs'
import { ButtonAuth } from '../../../components/Buttons/Buttons'
import { useAuth } from '../../../contexts/authContext'
import { useNavigate } from 'react-router-dom'

// Tela de login do usuário.
export const LoginUser = () => {
    // Estados dos campos do formulário.
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const navigate = useNavigate()

    // Função de login do contexto de autenticação.
    const { login, loading, token} = useAuth()

    // Efeito para navegar a página inicial com base no token.
    useEffect(()=>{
        if(token){
            navigate("/")
        }
    },[token, navigate])

    // Enviando formulário de login.
    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        await login(email,password) 
    }

    
    return(
        <div className="flex justify-center items-center w-screen h-screen max-md:h-full">
            <div className="flex flex-col items-center justify-center w-1/2 h-full rounded-[10px] max-md:w-full max-md:justify-around max-md:h-full">
                <div className="flex font-medium text-[2em] font-sans text-center mb-[2vh]">
                    Bem vindo de volta!
                </div>

                <form onSubmit={handleLogin} id="form_login" className="flex flex-col w-1/2 gap-[3vb] max-md:w-4/5">
                    <InputAuth title={'Email'} type={'email'} name={'email'} value={email} onChange={(e) => setEmail(e.target.value)} />
                    <InputAuth title={'Senha'} type={'password'} name={'password'} value={password} onChange={(e) => setPassword(e.target.value)} />
                    <div className="mb-2">
                        <Link to="/forgot" className="no-underline">Esqueceu a senha?</Link>
                    </div>
                    <ButtonAuth nomeBtn={`${loading ? "Carregando..." : "Login"}`} type={'submit'} />
                </form>

                <div className="mt-[4vh] font-light text-[1rem] font-sans">
                    Novo por aqui? <Link to="/register" className="font-bold no-underline">Cadastre-se</Link>
                </div>
            </div>

            <div className="flex w-1/2 h-screen items-center object-cover max-md:hidden">
                <img src={img_register} alt="" className="flex w-full h-full object-cover bg-center" />
            </div>
        </div>
    )
}