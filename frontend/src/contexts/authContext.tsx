import type { IEvent } from "@/components/Coordenador/Calendar/Calendar";
import { createContext, useContext, useState, useEffect, useCallback } from "react";
import type { Dispatch, ReactNode, SetStateAction } from "react";
import { toast } from "sonner";
// import { data, useParams } from "react-router-dom";

// Criando contexto de autenticação e variável de ambiente.

const api_url = import.meta.env.VITE_API_URL;

// Tipagem do usuario
export interface IUser {
  name: string;
  email: string;
  role: string;
  password?: string;
  confirmPass?: string;
}

interface IAuthContextProps {
  user: IUser | null;
  token: string | null;
  notes: any[] | null;
  loading: boolean;
  success: string | "";
  register: (
    name: string,
    email: string,
    password: string,
    confirmPass: string
  ) => Promise<boolean | void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  profile: (customToken: string) => Promise<void>;
  resetPassMail: (email: string) => Promise<void>;
  resetPass: (newPass: string, token: string) => Promise<void>;
  errorsRegister: string[];
  errorsLogin: string[];
  listEvents: () => Promise<any>
  events: IEvent[];
  setEvents: Dispatch<SetStateAction<IEvent[]>>;
  listNoteToPending: () => Promise<any[]>
}

const AuthContext = createContext<IAuthContextProps | undefined>(undefined);

// Provider que encapsula a lógica de autenticação e prove funções e estados para os componentes filhos.
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<IUser | null>(null);
  const [errorsRegister, setErrorsRegister] = useState<string[]>([]);
  const [errorsLogin, setErrorsLogin] = useState<string[]>([]);
  const [success, setSuccess] = useState<string | "">("");
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState<IEvent[]>([]);
  const [notes, setNotes] = useState<any[]>([]);

  // Verifica se já existe um token salvo no localStorage.
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (token) {
        setToken(token);
        await profile(token);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  //Buscando notificações apenas quando o token estiver definido
  useEffect(() => {
    const fetchNotes = async () => {
      await listNoteToPending();
    }

    fetchNotes();
  }, [token]);

  // Função de registro de um novo usuário;
  const register = async (
    name: string,
    email: string,
    password: string,
    confirmPass: string
  ) => {
    try {
      setLoading(true);
      setErrorsRegister([]);
      const res = await fetch(`${api_url}/api/users/register`, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({ name, email, password, confirmPass }),
      });

      const data = await res.json();
      console.log(data);

      if (res.ok) {
        console.log(data);

        //Limpa o localstorage ao criar outra conta
        localStorage.removeItem("token");
        setUser(null);
        setToken(null);

        setLoading(false);

        return true;
      } else {
        let formattedErrors: string[] = [];

        if (Array.isArray(data.errors)) {
          formattedErrors = data.errors.map((err: any) =>
            typeof err === "object" && "msg" in err ? err.msg : String(err)
          );
          setErrorsRegister(formattedErrors);
        } else if (data.message) {
          setErrorsRegister([data.message]);
        } else {
          setErrorsRegister(["Erro desconhecido ao tentar fazer login."]);
        }
      }
    } catch (error) {
      console.error(error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Função de login de usuário.
  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      setErrorsLogin([]);

      const res = await fetch(`${api_url}/api/users/login`, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        console.log(data);
        const token = data.token;
        localStorage.setItem("token", token);
        setToken(token);
        await profile(token);
        setLoading(false);
        toast.success(`Bem vindo(a)!`)
      } 
      else {
        console.log("data de erro recebido:", data);

        let formattedErrors: string[] = [];

        // Caso 1: Express Validator
        if (Array.isArray(data.errors)) {
          formattedErrors = data.errors.map((err: any) => {
            if (typeof err === "string") return err;
            if (typeof err === "object" && err.msg) return err.msg;
            return JSON.stringify(err);
          });
        }

        // Caso 2: array simples de strings
        else if (Array.isArray(data)) {
          formattedErrors = data.map((err: any) =>
            typeof err === "string" ? err : JSON.stringify(err)
          );
        }

        // Caso 3: objeto com message
        else if (typeof data.message === "string") {
          formattedErrors = [data.message];
        }

        // Caso 4: fallback
        else {
          formattedErrors = ["Erro desconhecido ao tentar fazer login."];
        }

        console.log("Erros formatados:", formattedErrors);
        setErrorsLogin(formattedErrors);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  //Sair da conta do usuário
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    toast.info("Até logo!");
  };

  //Dados de usuário
  const profile = async (customToken: string) => {
    setLoading(true);
    try {
      const res = await fetch(`${api_url}/api/users/profile`, {
        headers: {
          Authorization: `Bearer ${customToken}`,
        },
      });

      const data = await res.json();

      if (res.ok) {
        console.log(data);
        setUser(data);
      }
    } catch (error) {
      console.log(error);
    }
    finally{
      setLoading(false);
    }
  };

  // Função para envio do link de redefinição para o email.
  const resetPassMail = async (email: string) => {
    try {
      const res = await fetch(`${api_url}/api/users/send-reset`, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        console.log(data);
      } else {
        console.log(data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Função de alteração de senha (enviado por email).
  const resetPass = async (newPass: string, token: string) => {
    try {
      const res = await fetch(`${api_url}/api/users/reset-pass/${token}`, {
        method: "PATCH",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({ newPass }),
      });

      const data = await res.json();

      if (res.ok) {
        console.log(data);
      } else {
        console.log(data);
      }
    } catch (error) {
      console.error(error);
      console.log(error);
    }
  };

  //Listagem de eventos do calendário acadêmico
  const listEvents = 
  useCallback(
      async () => {
      try{

        const res = await fetch(`${api_url}/api/coordenador/list-events`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const dataJson = await res.json();

        if(res.ok){
            const formatted = dataJson.map((e: IEvent) => ({
            ...e,
            data: new Date(e.data),
          }));

          setEvents(formatted);
          return formatted;
        };

      }
      catch(error){
        console.log(error);
      }
    }, [api_url, token, setEvents]);

    //Listagem de notificações para pendentes
    const listNoteToPending = async () => {
      setLoading(true);
      console.log(token)
      try{
        const res = await fetch(`${api_url}/api/note/list-note-groups`,{
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const dataJson = await res.json();

        if(!res.ok){
          console.log(dataJson)
        }

        setNotes(dataJson);

        console.log(dataJson)

        return dataJson

      }
      catch(error){

      }
      finally{
        setLoading(false);
      }
    }
  


  // Retorno do contexto com as funções disponíveis.
  return (
    <AuthContext.Provider
      value={{
        register,
        notes,
        errorsRegister,
        listNoteToPending,
        errorsLogin,
        setEvents,
        listEvents,
        events,
        login,
        resetPassMail,
        resetPass,
        success,
        loading,
        user,
        token,
        logout,
        profile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Hook customizado para consumir o contexto.
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("UseAuth deve ser usado dentro do AuthProvider");
  }
  return context;
};
