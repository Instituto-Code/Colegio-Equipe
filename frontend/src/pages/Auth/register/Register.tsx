import { Link } from 'react-router-dom'

import img_register from '../../../assets/Images/img_auth.png'
import React, { useState } from 'react'
import { useAuth } from '../../../contexts/authContext'

import { InputAuth } from '../../../components/Inputs/Inputs'
import { ButtonAuth } from '../../../components/Buttons/Buttons'
import { useNavigate } from 'react-router-dom'

// Tela para cadastro de usuário.
export const SiginUser = () =>{
    // Estados dos campos do formulário.
    const [name, setNome] = useState("")    
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")    
    const [confirmPass, setConfirmPass] = useState("")
    const navigate = useNavigate()

    const { register, loading, success } = useAuth()

    //Enviando formulário de Registro
    const handleRegister = async (e: React.FormEvent<HTMLFormElement>)=>{
        e.preventDefault()

        const resposta = await register(name,email,password,confirmPass)

        setNome("")
        setEmail("")
        setPassword("")
        setConfirmPass("")

        if(resposta){
            navigate("/login")
        }
        
    }

    return(
         <div className="flex justify-center items-center w-screen max-md:h-screen">
            <div className="flex flex-col items-center justify-center w-1/2 h-full rounded-[10px] max-md:w-full max-md:justify-around max-md:h-full">
                <div className="flex font-medium text-[2em] font-sans text-center mb-[2vh]">
                    Cadastre-se!
                </div>
                {success && <p className="text-green-600 font-bold">{success}</p>}

                <form onSubmit={handleRegister} id="form_login" className="flex flex-col w-1/2 gap-[3vb] max-md:w-4/5">
                    <InputAuth title={'Nome'} placeHolder={'Ex: João'} type={'text'} name={'nome'} value={name} onChange={(e) => setNome(e.target.value)} />
                    <InputAuth title={'Email'} placeHolder={'Ex: joaozin@gmail.com'} name={'email'} value={email} onChange={(e) => setEmail(e.target.value)} />
                    <InputAuth title={'Senha'} type={'password'} name={'password'} value={password} onChange={(e) => setPassword(e.target.value)} />
                    <InputAuth title={'Confirme a senha'} type={'password'} name={'confirmPass'} value={confirmPass} onChange={(e) => setConfirmPass(e.target.value)} />
                    <ButtonAuth 
                    nomeBtn={`${loading ? "Carregando..." : "Cadastre-se"}`} 
                    type={'submit'}  />
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