import { Link } from 'react-router-dom'
import '../Global_auth.css'
import img_register from '../../../assets/Images/img_auth.png'
import { useState } from 'react'

import { InputAuth } from '../../../components/Inputs/Inputs'
import { ButtonAuth } from '../../../components/Buttons/Buttons'

// Tela para cadastro de usuário.
export const SiginUser = () =>{
    // Estados dos campos do formulário.
    const [nome, setNome] = useState("")    
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")    
    const [confirmPass, setConfirmPass] = useState("")

    return(
        <div className='content_register'>
            <div className='login_signin'>
                <div className='title_register' >Cadastre-se!</div>
                
                {/* Formulário de cadastro */}
                <form id='form_login' className='form_register'>
                    <InputAuth title={'Nome'} placeHolder={'Ex: João'} type={'text'} name={'nome'} value={nome} onChange={(e)=>{setNome(e.target.value)}}/>
                    <InputAuth title={'Email'} placeHolder={'Ex: joaozin@gmail.com'} name={'email'} value={email} onChange={(e)=>{setEmail(e.target.value)}}/>
                    <InputAuth title={'Senha'} type={'password'}name={'password'} value={password} onChange={(e)=>{setPassword(e.target.value)}}/>
                    <InputAuth title={'Confirme a senha'} type={'password'} name={'confirmPass'} value={confirmPass} onChange={(e)=>{setConfirmPass(e.target.value)}}/>
                    <ButtonAuth nomeBtn={'Cadastre-se'} type={'submit'} id={'btn_signin'}/>
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