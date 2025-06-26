import { Link } from 'react-router-dom'
import '../global_register.css'
import img_register from '../../../assets/img_register.png'
import { useState } from 'react'

export const SiginUser = () =>{
const [nome, setNome] = useState("")    
const [email, setEmail] = useState("")
const [password, setPassword] = useState("")    
const [confirmPass, setConfirmPass] = useState("")
    

return(
    <div className='content_register'>
        <div className='login_signin'>
            <div className='title_register' >Cadastre-se!</div>
            <form action="" id='form_login' className='form_register'>
            <div className='div_input'>
                <p>Nome</p>
                <input type="text" 
                name="name" 
                value={nome} 
                placeholder='Ex: João'
                onChange={(e)=>{setNome(e.target.value)}}
                />
            </div>
            <div className='div_input'>
                <p>Email</p>
                <input type="email"
                name="email"
                value={email} 
                placeholder='Ex:alberto123@gmail.com' 
                onChange={(e)=>{setEmail(e.target.value)}}
                />
            </div>
            <div className='div_input'>
                <p>Senha</p>
                <input type="password" 
                name="password" 
                value={password}
                onChange={(e)=>{setPassword(e.target.value)}}
                />
            </div>
            <div className='div_input'>
                <p>Confirme a Senha</p>
                <input type="password" 
                name='confirmPassword' 
                value={confirmPass}
                onChange={(e)=>{setConfirmPass(e.target.value)}}
                />
            </div>
            <div className='div_btn_form'>
                <button type='submit' id='btn_signin' className='btns_register'>SignIn</button>
            </div>
        </form>
        <div className='link_pages'>Já tem uma conta? <Link to="/">Clique aqui</Link></div>
    </div>
    <div className='img_register'>
        <img src={img_register} alt="" />
    </div>
    </div>
    
    )
}