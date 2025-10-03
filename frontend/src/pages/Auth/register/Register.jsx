import { Link } from 'react-router-dom'
import '../Global_auth.css'
import img_register from '../../../assets/Images/img_auth.png'
import { useState } from 'react'
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
    const handleRegister = async (e)=>{
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
        <div className='content_register'>
            <div className='login_signin'>
                <div className='title_register' >Cadastre-se!</div>
                {success && <p style={{color: "green", fontWeight: "bold"}}>{success}</p>}
                {/* Formulário de cadastro */}
                <form onSubmit={handleRegister} id='form_login' className='form_register'>
                    <InputAuth title={'Nome'} placeHolder={'Ex: João'} type={'text'} name={'nome'} value={name} onChange={(e)=>{setNome(e.target.value)}}/>
                    <InputAuth title={'Email'} placeHolder={'Ex: joaozin@gmail.com'} name={'email'} value={email} onChange={(e)=>{setEmail(e.target.value)}}/>
                    <InputAuth title={'Senha'} type={'password'} name={'password'} value={password} onChange={(e)=>{setPassword(e.target.value)}}/>
                    <InputAuth title={'Confirme a senha'} type={'password'} name={'confirmPass'} value={confirmPass} onChange={(e)=>{setConfirmPass(e.target.value)}}/>
                    <ButtonAuth
                    nomeBtn={`${loading ? "Carregando..." : "Cadastre-se"}`}  
                    type={'submit'} 
                    id={'btn_signin'}/>
                </form>

                {/* Link para login */}
                <div className='link_pages'>
                    Já tem uma conta? <Link to="/login">Clique aqui</Link>
                </div>
            </div>

            <div className='img_register'>
                <img src={img_register} alt="" />
            </div>
        </div>
        )
}