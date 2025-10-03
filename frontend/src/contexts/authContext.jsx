import { createContext, useContext, useState, useEffect } from "react";
// import { data, useParams } from "react-router-dom";

// Criando contexto de autenticação e variável de ambiente.
const AuthContext = createContext()
const api_url = import.meta.env.VITE_API_URL

// Provider que encapsula a lógica de autenticação e prove funções e estados para os componentes filhos.
export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(null)
    const [user, setUser] = useState({})
    // const [errors, setErrors] = useState([])
    const [success, setSuccess] = useState("")
    const [loading, setLoading] = useState(false)

    // Verifica se já existe um token salvo no localStorage.
    useEffect(()=>{
        const token = localStorage.getItem("token")
        if(token){
            setToken(token)
            profile(token)
        }
    },[])


    // Função de registro de um novo usuário;
    const register = async(name,email,password,confirmPass) => {
        try{
            setLoading(true)
            const res = await fetch(`${api_url}/api/users/register`, {
                method: 'POST',
                headers:{
                    'Content-type':'application/json'
                },
                body: JSON.stringify({name, email, password, confirmPass})
            })

            const data = await res.json()
            console.log(data)

            if(res.ok){
                console.log(data)
                setSuccess("Registro feito com sucesso!")
                setLoading(false)
                setInterval(() => {
                    setSuccess("")
                }, 3000)
                return true
            }
        }catch(error){
            console.error(error)        
            setSuccess("Falha ao registrar")   
            return false
        }finally{
            setLoading(false)
        }
    }

    // Função de login de usuário.
    const login = async(email, password) => {
        try{   
            setLoading(true)
            const res = await fetch(`${api_url}/api/users/login` , {
                method: 'POST',
                headers:{
                    'Content-type':'application/json'
                },
                body: JSON.stringify({email,password})
            })

            const data = await res.json()

            if(res.ok){
                console.log(data)
                const token = data.token
                localStorage.setItem("token", token)
                setToken(token)
                await profile(token)
                setLoading(false)
            }else{
                console.error("Login falhou", data.message)
            }

        }catch(error){
            console.log(error)
        }
        finally{
            setLoading(false)
        }
    }

    //Sair da conta do usuário
    const logout = () => {
        setUser(null)
        setToken(null)
        localStorage.removeItem("token")
    }

    //Dados de usuário
    const profile = async(customToken) => {
        try{
            const res = await fetch(`${api_url}/api/users/profile`, {
                headers: {
                    Authorization: `Bearer ${customToken}`
                }
            })

            const data = await res.json()

            if(res.ok){
                console.log(data)
                setUser(data)
            }
        }
        catch(error){
            console.log(error)
        }
    }

    // Função para envio do link de redefinição para o email.
    const resetPassMail = async(email)=> {
        try{
            const res = await fetch(`${api_url}/api/users/send-reset`, {
                method:'POST',
                headers:{
                    'Content-type':'application/json'
                },
                body: JSON.stringify({ email })
            })

            const data = await res.json()
            
            if(res.ok){
                console.log(data)
            }else{
                console.log(data)
            }
                
        }catch(error){
            console.error(error)
        }
    }

    // Função de alteração de senha (enviado por email).
    const resetPass = async(newPass, token) => {
        try{
            const res = await fetch(`${api_url}/api/users/reset-pass/${token}`, {
                method :'PATCH',
                headers:{
                    'Content-type':'application/json'
                },
                body: JSON.stringify({ newPass })

            })

            const data = await res.json()

            if(res.ok){
                console.log(data)
            }else{
                console.log(data)
            }
        }catch(error){
            console.error(error)
            console.log(error)
        }
        
    }
    // Retorno do contexto com as funções disponíveis.
    return(
        <AuthContext.Provider value={{register, login, resetPassMail, resetPass, success, loading, user, token, setSuccess, setToken, logout, profile}}>
            {children}
        </AuthContext.Provider>
    )

}

// Hook customizado para consumir o contexto.
export const useAuth = () =>{
    return useContext(AuthContext)
}