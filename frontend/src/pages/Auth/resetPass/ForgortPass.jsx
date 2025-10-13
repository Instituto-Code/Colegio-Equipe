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
       <div className="flex justify-center items-center w-screen max-md:h-full">
            <div className="flex flex-col items-center justify-center w-1/2 h-full rounded-[10px] max-md:w-full max-md:justify-around max-md:h-full">
                <div className="flex font-medium text-[2em] font-sans text-center mb-[4vh]" >
                    Esqueci minha senha
                </div>

                <form onSubmit={handleSubmit} id="form_login" className="flex flex-col w-1/2 gap-[60px] max-md:w-4/5">
                    <InputAuth title={'Seu email'} type={'email'} name={'email'} value={email} onChange={(e) => setEmail(e.target.value)} />
                    <ButtonAuth nomeBtn={'Enviar link'} type={'submit'} />
                </form>

                <div className="mt-[4vh] font-light text-[1rem] font-sans">
                    <Link to='/login' className="no-underline">Voltar para o login</Link>
                </div>
            </div>

            <div className="flex w-1/2 h-screen items-center object-cover max-md:hidden">
                <img src={img_register} alt="" className="flex w-full h-full object-cover bg-center" />
            </div>
        </div>
    )
}