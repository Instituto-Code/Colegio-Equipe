import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'

import img_register from '../../../assets/Images/img_auth.png'
import { InputAuth } from "../../../components/Inputs/Inputs"
import { ButtonAuth } from "../../../components/Buttons/Buttons"
import { useAuth } from '../../../contexts/authContext'


export const ResetPass = () =>{
    const { token } = useParams() 
    const [password, setPassword] = useState("")
    const [confirmPass, setConfirmPass] = useState("")

    const { resetPass } = useAuth()

    const handleSubmit = async (e) =>{
        e.preventDefault()
        console.log(token, password)

        await resetPass(password, token)
    }
    
    return(
        <div className='content_register'>
            <div className='login_signin'>
                <div className='title_register' style={{ marginBottom:'60px'}}>Redefinir senha</div>

                {/* Formulário para alteração de senha */}
                <form onSubmit={handleSubmit} id="form_login" className='form_register' style={{gap:'60px'}}>
                    <InputAuth title={'Nova Senha'} type={'password'} name={'password'} value={password} onChange={(e)=>{setPassword(e.target.value)}}></InputAuth>
                    <InputAuth title={'Confirme a senha'} type={'password'} name={'confirmPass'} value={confirmPass} onChange={(e)=>{setConfirmPass(e.target.value)}}></InputAuth>
                    <ButtonAuth nomeBtn={'Redefinir '} type={'submit'}></ButtonAuth>
                </form>
                
            </div>

            <div className='img_register'>
                <img src={img_register} alt="" />
            </div>
        </div>
    )
}