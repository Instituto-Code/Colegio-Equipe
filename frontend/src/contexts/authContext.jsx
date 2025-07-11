import { createContext, useContext, useState, useEffect } from "react";

// Criando contexto de autenticação e variável de ambiente.
const AuthContext = createContext()
const api_url = import.meta.env.VITE_API_URL

// Provider que encapsula a lógica de autenticação e prove funções e estados para os componentes filhos.
export const AuthProvider = ({ children }) => {

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





    // Retorno do contexto com as funções disponíveis.
    return(
        <AuthContext.Provider value={{register}}>
            {children}
        </AuthContext.Provider>
    )

}

// Hook customizado para consumir o contexto.
export const useAuth = () =>{
    return useContext(AuthContext)
}