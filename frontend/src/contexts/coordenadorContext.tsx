import { axiosInstance } from "@/api/axiosInstance";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { toast } from "sonner";
import type { ITurma } from "@/components/Coordenador/ClassGerence/ClassGerence";

export const api_url = import.meta.env.VITE_API_URL

type TipoEvento = 'feriado' | 'reunião' | 'aviso' | 'férias' | 'prova';

type Sexo = 'masculino' | 'feminino'

//Tipagem de turmas
export interface Turma {
    _id?: string;
    nome: string;
    turno: string;
    anoLetivo: number;
}

// Tipagem de Aluno
interface IAluno {
    nome: string
    matricula: string
    cpf: string
    dataNasc: number
    sexo: Sexo
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
    turmas: string[]
}

export interface INotes {
    id: string,
    author: {
        id: string,
        nome: string,
        email: string
    },
    receptor: {
        id: string;
        nome: string;
        email: string;
        role: string;
    },
    tipo: string,
    conteudo: string,
    visto: string[]
}

// Interface para o Provider do coordenador
interface ICoordenatorProps {
    alunos: IAluno[]
    professores: Professor[] | null
    classes: ITurma[] | null
    token: string | null
    overview: {
        totalAlunos: number
        totalProfessores: number
        totalTurmas: number
        totalDisciplinas: number
    } | null
    Alunos: () => Promise<void>
    Professores: () => Promise<any>
    Turmas: () => Promise<void>
    Overview: (customToken: string) => Promise<void>
    registerEvent: (titulo: string, descricao: string, data: Date, tipo: TipoEvento) => Promise<void>
    loading: boolean
    registerClasses: (nome: string, turno: string, anoLetivo: number) => Promise<any>
    registerStudent: (nome: string, matricula: string, cpf: string, dataNasc: number, sexo: Sexo) => Promise<any>
    registerParent: (userID: string) => Promise<any>
    registerTeacher: (userID: string, matricula: string, formacao: string) => Promise<any>
    addStudentToClass: (studentId: string, classId: string) => Promise<any>
    removeStudentClass: (studentId: string, classId: string) => Promise<any>
    removeTeacherClass: (teacherId: string, classId: string) => Promise<any>
    addTeacherToClass: (classId: string, teacherId: string) => Promise<any>
    relationParentStudent: (parentId: string, studentId: string) => Promise<any>
    notesSend: () => Promise<INotes[]>
}

// Contexto do coordenador
const CoordenadorContext = createContext<ICoordenatorProps | undefined>(undefined)

//Provider que encapsula a lógica do coordenador e prove funções e estados para os componentes filhos.
export const CoordenadorProvider = ({ children }: { children: ReactNode }) => {
    const [token, setToken] = useState<string | null>(null)
    const [alunos, setAlunos] = useState<IAluno[]>([])
    const [classes, setClasses] = useState<ITurma[] | null>(null)
    const [professores, setProfessores] = useState<Professor[]>([])
    const [overview, setOverview] = useState(null)
    const [loading, setLoading] = useState(false);

    // Efeito para pegar o token do localstorage se existir um token
    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem("token")
            if (token) {
                setToken(token)
                await Overview(token)
            }
        }
        fetchData();
    }, [])

    // Função para pegar os dados do overview do dashboard
    const Overview = async (customToken: string) => {
        setLoading(true)
        try {
            const res = await axiosInstance.get(`/api/coordenador/getDashboardOverview`, {
                headers: {
                    Authorization: `Bearer ${customToken}`
                }
            })

            const data = await res.data

            setOverview(data)
        }
        catch (error) {
            console.log(error)
        }
        finally {
            setLoading(false);
        }
    }


    //  Função para pegar dados dos alunos.
    const Alunos = async () => {
        setLoading(true)
        try {
            const res = await axiosInstance.get(`/api/coordenador/list-students`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            const data = await res.data

            setAlunos(data.alunos)
            return data.alunos
        }
        catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    //Função para pegar dados dos professores
    const Professores = async () => {
        try {
            const res = await axiosInstance.get(`/api/coordenador/list-teachers`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            const data = await res.data
            setProfessores(data.professores)
            return data
        }
        catch (error) {
            console.log(error)
        }
    }

    // Listando todas as turmas da escola
    const Turmas = async () => {
        setLoading(true)
        try {
            const res = await axiosInstance.get(`/api/coordenador/list-turmas`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            const data = await res.data
            setClasses(data)
            return data
        }
        catch (error) {
            console.log(error)
        }
        finally {
            setLoading(false)
        }
    }

    //Cadastro de eventos no calendário
    const registerEvent = async (titulo: string, descricao: string, data: Date, tipo: TipoEvento) => {
        try {
            setLoading(true);
            const res = await axiosInstance.post(`/api/coordenador/create-event`,
                {
                    titulo,
                    descricao,
                    data,
                    tipo
                },
                {
                    headers: {
                        "Content-type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                }

            );

            const dataJson = await res.data;

            return dataJson;
        }
        catch (error) {
            console.log(error);
            throw error;
        }
        finally {
            setLoading(false);
        }
    }

    //Função para criar turmas
    const registerClasses = async (nome: string, turno: string, anoLetivo: number) => {
        try {
            setLoading(true);
            const res = await axiosInstance.post(`/api/coordenador/register-classes`,
                {
                    nome,
                    turno,
                    anoLetivo
                },
                {
                    headers: {
                        "Content-type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                });

            const data = await res.data;

            const newClass: ITurma = data;

            setClasses((prevClass) => [...(prevClass ?? []), newClass]);

            return newClass;
        }
        catch (error: any) {
            console.log(error);
            toast(`Erro: ${error.errors[0]}`);
            throw new Error(error.msg || `Erro HTTP: ${error.status}`)
        }
        finally {
            setLoading(false);
        }
    }

    //Função para registrar um aluno (matrícula)
    const registerStudent = async (nome: string, matricula: string, cpf: string, dataNasc: number, sexo: Sexo) => {
        setLoading(true)
        try {
            const res = await axiosInstance.post("api/coordenador/register-students", {
                nome,
                matricula,
                cpf,
                dataNasc,
                sexo
            })

            const data = await res.data

            const newAluno: IAluno = data.aluno
            setAlunos((prevAlunos) => [...prevAlunos, newAluno])

            return data
        }
        catch (error: any) {
            throw new Error(error.message || 'Erro ao comunicar com o servidor')
        }
        finally {
            setLoading(false)
        }
    }

    // Função para registrar um Professor. 
    const registerTeacher = async (user: string, matricula: string, formacao: string) => {
        try {
            const res = await axiosInstance.post(`/api/coordenador/register-teacher`,
                {
                    user,
                    matricula,
                    formacao
                }, {
                headers: {
                    'Content-Type': "application/json",
                    Authorization: `Bearer ${token}`
                },
            })

            const data = await res.data

            return data
        }
        catch (error: any) {
            throw new Error(error.message || 'Erro ao comunicar com o servidor')
        }
    }

    // Função para registrar um pai
    const registerParent = async (userId: string) => {
        setLoading(true)
        try {
            const res = await axiosInstance.patch(`/api/coordenador/register-parent/${userId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            const data = await res.data

            return data
        }
        catch (error: any) {
            throw new Error(error.message || 'Erro ao comunicar com o servidor')
        }
        finally {
            setLoading(false)
        }
    }

    //Adicionar aluno à turma
    const addStudentToClass = async (studentId: string, classId: string) => {
        setLoading(true)
        try {
            console.log(classId)
            const res = await axiosInstance.patch(`/api/coordenador/student/${studentId}/class/${classId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const dataJson = await res.data;

            toast.success("Aluno(a) adicionado(a) com sucesso.");
            return dataJson;

        }
        catch (error: any) {
            console.log(error);
            throw error
        }
        finally {
            setLoading(false);
        }
    }

    // Remover aluno de uma turma
    const removeStudentClass = async (studentId: string, className: string) => {
        setLoading(true)
        try {
            const res = await axiosInstance.patch(`/api/coordenador/student/${studentId}/classroom`,
                { className },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json"
                    },
                })

            const dataJson = await res.data

            toast.success("Aluno removido com sucesso")
            return dataJson
        }
        catch (error: any) {
            console.error(error)
            toast.error("Não foi possível remover o aluno")
        }
        finally {
            setLoading(false)
        }
    }

    // Remover professor de uma turma
    const removeTeacherClass = async (teacherId: string, className: string) => {
        setLoading(true)
        try {
            const res = await axiosInstance.patch(`/api/coordenador/teacher/${teacherId}/classroom`,
                { className },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json"
                    },
                })

            const dataJson = await res.data

            toast.success("Professor removido com sucesso")
            return dataJson
        }
        catch (error: any) {
            console.error(error)
            toast.error("Não foi possível remover o professor")
        }
        finally {
            setLoading(false)
        }
    }

    //Adicionar professor a uma turma
    const addTeacherToClass = async (classId: string, teacherId: string) => {
        setLoading(true)
        try {
            const res = await axiosInstance.patch(`/api/coordenador/class/${classId}/teacher/${teacherId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const dataJson = await res.data;

            toast.success("Professor vinculado à turma com sucesso!");
            return dataJson;
        }
        catch (error) {
            console.log(error);
            toast.error("Não foi possível vincular um professor a turma")
        }
        finally {
            setLoading(false);
        }
    }

    // Relacionar aluno a um pai
    const relationParentStudent = async (studentId: string, parentId: string) => {
        setLoading(true)
        try {
            const res = await axiosInstance.patch(`/api/coordenador/student/${studentId}/parent/${parentId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            const dataJson = await res.data

            console.log(dataJson)

            return dataJson
        }
        catch (error) {
            console.error(error)
            throw error
        }
        finally {
            setLoading(false)
        }
    }

    // Listagem de notificações enviadas
    const notesSend = async () => {
        setLoading(true);
        try {
            const res = await axiosInstance.get(`/api/note/list-all/notifications`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const dataJson = await res.data;

            return dataJson
        }
        catch (error) {
            console.log(error);
            toast.error("Erro ao listar notificações.");
        }
        finally {
            setLoading(false);
        }
    }


    // Retorno do contexto com as funções disponíveis
    return (
        <CoordenadorContext.Provider
            value={{
                token,
                notesSend,
                addTeacherToClass,
                addStudentToClass,
                removeStudentClass,
                removeTeacherClass,
                registerClasses,
                registerStudent,
                registerParent,
                registerTeacher,
                loading,
                registerEvent,
                relationParentStudent,
                alunos,
                professores,
                classes,
                overview,
                Alunos,
                Professores,
                Turmas,
                Overview
            }}>
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