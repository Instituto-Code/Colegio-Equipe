import './Inputs.css'

// Inputs para páginas de autenticação de usuário.
export const InputAuth = ({title, type, name, value , onChange, placeHolder}) => {
    return(
        <div className='div_input_auth'>
            <p className='p_auth'>{title}</p>
            <input className='input_auth'
                placeholder={placeHolder} 
                type={type} 
                name={name} 
                value={value} 
                onChange={onChange}
            />                  
        </div>
    )
    
}