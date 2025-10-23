import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import img_register from "../../../assets/Images/img_auth.png";
import { useAuth } from "../../../contexts/authContext";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Mail, Lock } from "lucide-react";

type LoginFormData = {
  email: string;
  password: string;
};

export const LoginUser = () => {
  const navigate = useNavigate();
  const { login, loading, token, errorsLogin } = useAuth();

  // Configuração do React Hook Form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Redireciona se já estiver logado
  useEffect(() => {
    if (token) navigate("/");
  }, [token, navigate]);

  // Envio do formulário
  const onSubmit = async (data: LoginFormData) => {
    await login(data.email, data.password);
  };

  return (
    <div className="flex justify-center items-center w-screen h-screen max-md:h-full">
      <div className="flex flex-col items-center justify-center w-1/2 h-full rounded-[10px] max-md:w-full max-md:justify-around max-md:h-full">
        <h1 className="font-medium text-[2em] font-sans text-center mb-[2vh]">
          Bem vindo de volta!
        </h1>

        {/* Exibe erros de autenticação */}
        {errorsLogin.length > 0 && (
          <Alert variant="destructive" className="border-0 flex flex-col justify-center items-center">
            <div className='flex gap-1.5'>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Erro</AlertTitle>
            </div>
            <AlertDescription>
              <ul className="list-disc list-inside space-y-1">
                {errorsLogin.map((err, i) =>
                  err ? <li key={i}>{err}</li> : null
                )}
              </ul>
            </AlertDescription>
          </Alert>
        )}

        {/* Formulário React Hook Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col w-1/2 gap-[3vb] max-md:w-4/5"
        >
          {/* Campo Email */}
          <div className="flex flex-col gap-1">
            <label htmlFor="email" className="font-medium text-sm">
              Email
            </label>

            <div className="relative">
              <Input
                id="email"
                type="email"
                placeholder="Seu E-mail"
                className={cn(
                  errors.email
                    ? "border-red-500 focus-visible:ring-red-500 pl-10"
                    : "border-gray-300 pl-10"
                )}
                {...register("email", {
                  required: "O e-mail é obrigatório",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Digite um e-mail válido",
                  },
                })}
              />
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>

            {errors.email && (
              <span className="text-sm text-red-500">
                {errors.email.message}
              </span>
            )}
          </div>

          {/* Campo Senha */}
          <div className="flex flex-col gap-1">
            <label htmlFor="password" className="font-medium text-sm">
              Senha
            </label>
            <div className="relative">
              <Input
                id="password"
                type="password"
                placeholder="Sua senha"
                className={cn(
                  errors.password
                    ? "border-red-500 focus-visible:ring-red-500 pl-10"
                    : "border-gray-300 pl-10"
                )}
                {...register("password", {
                  required: "A senha é obrigatória",
                  minLength: {
                    value: 6,
                    message: "A senha deve ter pelo menos 6 caracteres",
                  },
                })}
              />
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
            {errors.password && (
              <span className="text-sm text-red-500">
                {errors.password.message}
              </span>
            )}
          </div>

          <div className="mb-2">
            <Link to="/forgot" className="no-underline">
              Esqueceu a senha?
            </Link>
          </div>

          <Button
            disabled={loading}
            type="submit"
            className="bg-[#303A73] hover:bg-[#181f44] cursor-pointer"
          >
            {loading ? (
              <span className="flex gap-1.5 items-center">
                <Spinner /> Carregando
              </span>
            ) : (
              "Login"
            )}
          </Button>
        </form>

        <div className="mt-[4vh] font-light text-[1rem] font-sans">
          Novo por aqui?{" "}
          <Link to="/register" className="font-bold no-underline">
            Cadastre-se
          </Link>
        </div>
      </div>

      <div className="flex w-1/2 h-screen items-center object-cover max-md:hidden">
        <img
          src={img_register}
          alt="Login"
          className="flex w-full h-full object-cover bg-center"
        />
      </div>
    </div>
  );
};
