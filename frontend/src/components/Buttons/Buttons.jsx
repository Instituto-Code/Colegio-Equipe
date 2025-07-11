import './Buttons.css'

// Botão para páginas de autenticação do usuário.
export const ButtonAuth = ({type, id, nomeBtn}) =>{
    return(
        <div className='div_btn_form_auth'>
            <button 
                type={type} 
                id={id} className='btns_auth'
            >
            {nomeBtn}
            </button>
        </div>
    )
}