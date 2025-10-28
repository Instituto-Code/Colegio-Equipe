import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { toast } from "sonner";

export const api_url = import.meta.env.VITE_API_URL

type TipoEvento = 'feriado'| 'reunião'| 'aviso'| 'férias'| 'prova';

//Tipagem de turmas
export interface Turma {
    _id?: string;
    nome: string;
    turno: string;
    anoLetivo: number;
}

//Tipagem de disciplina para professor
interface IDisciplina {
    id: string;
    nome: string;
    descricao: string;
    cargaHoraria: string;
}

//Tipagem para professor
export interface Professor {
  id: string;
  nome: string;
  matricula: string;
  formacaoAcademica?: string;
  disciplinas: IDisciplina[];
}



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
    registerEvent: (titulo: string, descricao: string, data: Date, tipo: TipoEvento) => Promise<void>
    loading: boolean
    registerClasses: (nome: string, turno: string, anoLetivo: number) => Promise<any>
    addStudentToClass: (studentId: string, classId: string) => Promise<any>
}

// Contexto do coordenador
const CoordenadorContext = createContext<ICoordenatorProps | undefined>(undefined)

//Provider que encapsula a lógica do coordenador e prove funções e estados para os componentes filhos.
export const CoordenadorProvider = ({ children }: { children: ReactNode }) => {
    const [token, setToken] = useState<string | null>(null)
    const [alunos, setAlunos] = useState<[] | null>(null)
    const [classes, setClasses] = useState<Turma[]>([]);
    const [professores, setProfessores] = useState<Professor[]>([])
    const [overview, setOverview] = useState(null)
    const [loading, setLoading] = useState(false);

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

    //Cadastro de eventos no calendário
    const registerEvent = async (titulo: string, descricao: string, data: Date, tipo: TipoEvento) => {
        try{
            setLoading(true);
            const res = await fetch(`${api_url}/api/coordenador/create-event`, {
                method: "POST",
                headers: {
                    "Content-type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ titulo, descricao, data, tipo })
            });

            const dataJson = await res.json();

            if(dataJson.ok){
               console.log("Evento cadastrado:", dataJson);
               return dataJson;
            };

        }
        catch(error){
            console.log(error);
            throw error;
        }
        finally{
            setLoading(false);
        }
    }

    //Função para criar turmas
    const registerClasses = async (nome: string, turno: string, anoLetivo: number) => {
        try{    
            setLoading(true);
            const res = await fetch(`${api_url}/api/coordenador/register-classes`, {
                method: "POST",
                headers: {
                    "Content-type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ nome, turno, anoLetivo })
            });

            const data = await res.json();

            if (!res.ok) {
                toast(`Erro: ${data.errors[0]}`);
                throw new Error(data.msg || `Erro HTTP: ${res.status}`); 
                
            }

            const newClass: Turma = data;

            setClasses((prevClass) => [...prevClass, newClass]);

            return newClass;

        }
        catch(error: any){
            console.log(error);
            throw error;
        }
        finally{
            setLoading(false);
        }
    }

    //Adicionar aluno à turma
    const addStudentToClass = async (studentId: string, classId: string) => {
        setLoading(true)
        try{
            const res = await fetch(`${api_url}/api/coordenador/studentToClass`, {
                method: "PATCH",
                headers: {
                    "Content-type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ studentId, classId })
            });

            const dataJson = await res.json();

            if (!res.ok) {
                console.log("Erro ao requisitar ação: ", dataJson);
                // Lança o objeto de erro (que pode conter a mensagem do Express Validator)
                throw dataJson; 
            }

            return dataJson;

        }
        catch(error){
            console.log(error);
        }
        finally{
            setLoading(false);
        }
    }


    // Retorno do contexto com as funções disponíveis
    return (
        <CoordenadorContext.Provider value={{ token, addStudentToClass, registerClasses, loading, registerEvent, alunos, professores, overview, Alunos, Professores, Overview }}>
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