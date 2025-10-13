import { useState } from 'react'
import { useParams } from 'react-router-dom'

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
        <div className="flex justify-center items-center w-screen max-md:h-full">
            <div className="flex flex-col items-center justify-center w-1/2 h-full rounded-[10px] max-md:w-full max-md:justify-around max-md:h-full">
                <div className="flex font-medium text-[2em] font-sans text-center mb-[4vh]">
                    Redefinir senha
                </div>

                <form onSubmit={handleSubmit} id="form_login" className="flex flex-col w-1/2 gap-[60px] max-md:w-4/5">
                    <InputAuth title={'Nova Senha'} type={'password'} name={'password'} value={password} onChange={(e) => setPassword(e.target.value)} />
                    <InputAuth title={'Confirme a senha'} type={'password'} name={'confirmPass'} value={confirmPass} onChange={(e) => setConfirmPass(e.target.value)} />
                    <ButtonAuth nomeBtn={'Redefinir '} type={'submit'} />
                </form>
            </div>

            <div className="flex w-1/2 h-screen items-center object-cover max-md:hidden">
                <img src={img_register} alt="" className="flex w-full h-full object-cover bg-center" />
            </div>
        </div>
    )
}