import { useState } from 'react'
import { Link } from 'react-router-dom'

import img_register from '../../../assets/Images/img_auth.png'
import { InputAuth } from "../../../components/Inputs/Inputs"
import { ButtonAuth } from "../../../components/Buttons/Buttons"
import { useAuth } from '../../../contexts/authContext'

// Tela de requisição do email para envio do link de redefinição.
export const ForgotPass = () =>{
    // Estados dos campos do formulário.
    const [email, setEmail] = useState("")
   
    const { resetPassMail } = useAuth()

    const handleSubmit = (e) => {
        e.preventDefault()

        resetPassMail(email)
    }

    
    return(
        <div className='content_register'>
            <div className='login_signin'>
                <div className='title_register' style={{ marginBottom:'60px'}}>Esqueci minha senha</div>

                {/* Formulário de envio de email */}
                <form onSubmit={handleSubmit} id="form_login" className='form_register' style={{gap:'60px'}}>
                    <InputAuth title={'Seu email'} type={'email'} name={'email'} value={email} onChange={(e)=>{setEmail(e.target.value)}}></InputAuth>
                    <ButtonAuth nomeBtn={'Enviar link'} type={'submit'}></ButtonAuth>
                </form>
                {/* Link para o login */}
                <div className='link_pages'><Link to='/login'>Voltar para o login</Link></div>
            </div>

            <div className='img_register'>
                <img src={img_register} alt="" />
            </div>
        </div>
    )
}