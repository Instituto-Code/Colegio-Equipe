import styles from './login.module.css'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import img_register from '../../../assets/img_register.png'


export const LoginUser = () =>{
    const [email, setEmail] = useState("")
    const [senha, setSenha] = useState("")
    
    return(
        <div className='content_register'>
            <div className='login_signin'>
                <div className='title_register'>Bem vindo de volta!</div>
                <form action="" id="form_login" className='form_register'>
                    <div className='div_input'>
                        <p>E-mail</p>
                        <input type="email" name="email" value={email} onChange={(e)=>{setEmail(e.target.value)}}/>
                    </div>
                    <div className='div_input'>
                        <p>Senha</p>
                        <input type="password" name='password' value={senha} onChange={(e)=>{setSenha(e.target.value)}}/>
                        <p><Link to="">Esqueceu a senha?</Link></p>
                    </div>
                    <div className='div_btn_form'>
                        <button type='submit' id='btn_login' className='btns_register'>Login</button>
                    </div>
                </form>
                <div className='link_pages'>Novo por aqui? <Link to="/SignIn">Cadastre-se</Link></div>
            </div>
            <div className='img_register'>
                <img src={img_register} alt="" />
            </div>
        </div>
       
    )
}