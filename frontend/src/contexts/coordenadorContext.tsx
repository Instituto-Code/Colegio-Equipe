import { createContext, useContext, useEffect, useState, type ReactNode } from "react"

export const api_url = import.meta.env.VITE_API_URL

// Interface para o Provider do coordenador
interface ICoordenatorProps {
    alunos: [] | null
    professores: [] | null
    token: string | null
    overview: {
        totalAlunos: number
        totalProfessores: number
        totalTurmas: number
        totalDisciplinas: number
    } | null
    Alunos: (customToken: string) => Promise<void>
    Professores: (customToken: string) => Promise<void>
    Overview: (customToken: string) => Promise<void>
}

// Contexto do coordenador
const CoordenadorContext = createContext<ICoordenatorProps | undefined>(undefined)

//Provider que encapsula a lógica do coordenador e prove funções e estados para os componentes filhos.
export const CoordenadorProvider = ({ children }: { children: ReactNode }) => {
    const [token, setToken] = useState<string | null>(null)
    const [alunos, setAlunos] = useState<[] | null>(null)
    const [professores, setProfessores] = useState<[] | null>(null)
    const [overview, setOverview] = useState(null)

    // Efeito para pegar o token do localstorage se existir um token
    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem("token")
            if (token) {
                setToken(token)
                // await Alunos(token)
                // await Professores(token)
                await Overview(token)
            }
        }
        fetchData();
    }, [])


    const Overview = async (customToken: string) => {
        try {
            const res = await fetch(`${api_url}/api/coordenador/getDashboardOverview`, {
                headers: {
                    Authorization: `Bearer ${customToken}`
                }
            })

            const data = await res.json()

            if (res.ok) {
                console.log(data)
                setOverview(data)
            }
        }
        catch (error) {
            console.log(error)
        }
    }


    //  Função para pegar dados dos alunos.
    const Alunos = async (customtoken: string) => {
        try {
            const res = await fetch(`${api_url}/api/coordenador/list-students`, {
                headers: {
                    Authorization: `Bearer ${customtoken}`
                }
            })

            const data = await res.json()

            if (res.ok) {
                //console.log(data.alunos)
                setAlunos(data.alunos)
            }

        }
        catch (error) {
            console.log(error)
        }
    }

    //Função para pegar dados dos professores
    const Professores = async (customToken: string) => {
        try {
            const res = await fetch(`${api_url}/api/coordenador/list-teachers`, {
                headers: {
                    Authorization: `Bearer ${customToken}`
                }
            })

            const data = await res.json()

            if (res.ok) {
                //console.log(data.professores)
                setProfessores(data.professores)
            }
        }
        catch (error) {
            console.log(error)
        }
    }

    // Retorno do contexto com as funções disponíveis
    return (
        <CoordenadorContext.Provider value={{ token, alunos, professores, overview, Alunos, Professores, Overview }}>
            {children}
        </CoordenadorContext.Provider>
    )

}

export const useCoordenador = () => {
    const context = useContext(CoordenadorContext)
    if (!context) {
        throw new Error("UseCoordenador deve ser usado dentro do AuthProvider")
    }
    return context
}