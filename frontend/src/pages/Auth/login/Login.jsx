import { useState } from 'react'
import { Link } from 'react-router-dom'
import img_register from '../../../assets/Images/img_auth.png'

import { InputAuth } from '../../../components/Inputs/Inputs'
import { ButtonAuth } from '../../../components/Buttons/Buttons'
import { useAuth } from '../../../contexts/authContext'

// Tela de login do usuário.
export const LoginUser = () => {
    // Estados dos campos do formulário.
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    // Função de login do contexto de autenticação.
    const { login } = useAuth()
    
    // Enviando formulário de login.
    const handleSubmit = (e) =>{
        e.preventDefault()

        login(email,password)
    }
    
    return(
        <div className='content_register'>
            <div className='login_signin'>
                <div className='title_register'>Bem vindo de volta!</div>

                {/* Formulário de login */}
                <form onSubmit={handleSubmit} id="form_login" className='form_register'>
                    <InputAuth title={'Email'} type={'email'} name={'email'} value={email} onChange={(e)=>{setEmail(e.target.value)}}/>
                    <InputAuth title={'Senha'} type={'password'} name={'password'} value={password} onChange={(e)=>{setPassword(e.target.value)}}/>
                    <div className='forgot_pass'><Link to="/forgot">Esqueceu a senha?</Link></div>
                    <ButtonAuth nomeBtn={'Login'} type={'submit'} id={'btn_login'}  />
                </form>

                {/* Link para o registro */}
                <div className='link_pages'>
                    Novo por aqui? <Link to="/register">Cadastre-se</Link>
                    </div>
            </div>

            <div className='img_register'>
                <img src={img_register} alt="" />
            </div>
        </div>
    )
}