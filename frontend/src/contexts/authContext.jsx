import { createContext, useContext, useState, useEffect } from "react";

// Criando contexto de autenticação e variável de ambiente.
const AuthContext = createContext()
const api_url = import.meta.env.VITE_API_URL

// Provider que encapsula a lógica de autenticação e prove funções e estados para os componentes filhos.
export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(null)
    const [user, setUser] = useState({})

    // Verifica se já existe um token salvo no localStorage.
    useEffect(()=>{
        const token = localStorage.getItem("token")
        if(token && user){
            setToken(token)
        }
    })


    // Função de registro de um novo usuário;
    const register = async(name,email,password,confirmPass) => {
        try{
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
            }
        }catch(error){
            
            console.error(error)           
        }
    }

    // Função de login de usuário.
    const login = async(email, password) => {
        try{   
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
            }else{
                console.error("Login falhou", data.message)
            }

        }catch(error){
            console.log(error)
        }
    }



    // Retorno do contexto com as funções disponíveis.
    return(
        <AuthContext.Provider value={{register, login}}>
            {children}
        </AuthContext.Provider>
    )

}

// Hook customizado para consumir o contexto.
export const useAuth = () =>{
    return useContext(AuthContext)
}