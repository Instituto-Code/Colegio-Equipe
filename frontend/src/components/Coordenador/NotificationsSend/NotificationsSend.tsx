import { useState, useEffect } from "react";
import { MoveHorizontal, Send, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  api_url,
  useCoordenador,
  type INotes,
} from "@/contexts/coordenadorContext";
import { useAuth } from "@/contexts/authContext";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";
import { axiosInstance } from "@/api/axiosInstance";

interface INotificationsProps {
  open: boolean;
  onOpenChange: (value: boolean) => void;
}

export function NotificationsSend({ open, onOpenChange }: INotificationsProps) {
  const [type, setType] = useState<"pessoa" | "grupo">("pessoa");
  const [target, setTarget] = useState<string | null>(null);
  const [conteudo, setConteudo] = useState("");
  const [users, setUsers] = useState<any[]>([]);
  const [loadingHere, setLoadingHere] = useState(false);
  const [noteSend, setNotesSend] = useState<INotes[] | []>([]);
  const [activeTab, setActiveTab] = useState<"enviar" | "enviadas">("enviar");

  const { token, user } = useAuth();
  const { notesSend, loading } = useCoordenador();

  //Busca usuários do backend (quando for "pessoa")
  useEffect(() => {
    if (!open || type !== "pessoa" || !token) return;

    const fetchUsers = async () => {
      try {
        const res = await axiosInstance.get("/api/coordenador/list-users", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setUsers(res.data.users);
      } catch (error) {
        console.error(error);
        toast.error("Erro ao carregar usuarios");
      }
    };

    fetchUsers();
  }, [open, type, token]);

  const handleSubmit = async () => {
    setLoadingHere(true);

    try {
      if (!conteudo || !type || (!target && type === "pessoa"))
        return alert("Preencha todos os campos!");

      const body =
        type === "pessoa"
          ? { conteudo, tipo: "pessoa", pessoa: target }
          : { conteudo, tipo: "grupo", grupo: target };

      console.log(body);

      const res = await fetch(`${api_url}/api/note/create-note`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        toast.success("Mensagem enviada com sucesso!");
        setConteudo("");
        setTarget(null);
        onOpenChange(false);
      } else {
        const err = await res.json();
        alert(err.error || "Erro ao enviar");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingHere(false);
    }
  };

  const handleList = async () => {
    const notes = await notesSend();

    setNotesSend(notes);
  };

  useEffect(() => {
    if (activeTab === "enviadas" && token) {
      handleList(); // busca as notas enviadas
    }
  }, [activeTab, token]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Enviar Notificações</DialogTitle>
          <DialogDescription>
            Envie mensagens para um usuário específico ou um grupo inteiro.
          </DialogDescription>
        </DialogHeader>

        <Tabs
          value={activeTab}
          onValueChange={(v) => setActiveTab(v as "enviar" | "enviadas")}
        >
          <TabsList>
            {user?.role === "coordenador" ? (
              <>
                <TabsTrigger value="enviar">Mensagem</TabsTrigger>

                <TabsTrigger value="enviadas">Enviadas</TabsTrigger>
              </>
            ) : (
              <TabsTrigger value="mensagens">Mensagens</TabsTrigger>
            )}
          </TabsList>

          {/* ABA DE ENVIAR */}
          {user?.role === "coordenador" && (
            <>
              {/* ABA DE ENVIAR */}
              <TabsContent value="enviar">
                <Card className="h-90">
                  <CardContent className="grid gap-4">
                    {/* SELECT DE TIPO */}
                    <div className="grid gap-2">
                      <Label>Tipo de envio</Label>
                      <Select
                        value={type}
                        onValueChange={(v: "pessoa" | "grupo") => setType(v)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Escolha o tipo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pessoa">Pessoa</SelectItem>
                          <SelectItem value="grupo">Grupo</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* SELECT DE DESTINO */}
                    <div className="grid gap-2">
                      <Label>{type === "pessoa" ? "Pessoa" : "Grupo"}</Label>
                      <Select value={target || ""} onValueChange={setTarget}>
                        <SelectTrigger>
                          <SelectValue
                            placeholder={
                              type === "pessoa"
                                ? "Selecione uma pessoa"
                                : "Selecione um grupo"
                            }
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {type === "pessoa" ? (
                            Array.isArray(users) &&
                            users.map((u) => (
                              <SelectItem key={u.id} value={u.id}>
                                {u.nome}
                              </SelectItem>
                            ))
                          ) : (
                            <>
                              <SelectItem value="professor">
                                Professores
                              </SelectItem>
                              <SelectItem value="responsavel">
                                Responsáveis
                              </SelectItem>
                              <SelectItem value="aluno">Alunos</SelectItem>
                              <SelectItem value="pendente">
                                Pendentes
                              </SelectItem>
                            </>
                          )}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* TEXTAREA */}
                    <div className="grid gap-2">
                      <Label>Mensagem</Label>
                      <Textarea
                        placeholder="Escreva sua mensagem..."
                        value={conteudo}
                        onChange={(e) => setConteudo(e.target.value)}
                      />
                    </div>
                  </CardContent>

                  <CardFooter className="justify-end">
                    <Button
                      onClick={handleSubmit}
                      className="bg-blue-500 cursor-pointer text-white hover:bg-blue-600"
                    >
                      {loadingHere ? (
                        <span className="flex items-center justify-center gap-1">
                          <Spinner /> Enviando...
                        </span>
                      ) : (
                        <span className="flex gap-1 items-center justify-center">
                          <Send className="mr-2 w-4 h-4" /> Enviar
                        </span>
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>

              {/* ABA DE ENVIADAS */}
              <TabsContent value="enviadas">
                <Card className="h-90 overflow-y-auto">
                  <CardContent>
                    {loading ? (
                      <div className="h-50 flex justify-center items-center w-100">
                        <Spinner className="size-8 text-blue-500" />
                      </div>
                    ) : noteSend.length === 0 ? (
                      <span>Nenhuma mensagem enviada...</span>
                    ) : (
                      noteSend.map((n) => (
                        <div
                          key={n.id}
                          className="flex items-start gap-3 border-b pb-3"
                        >
                          <User className="w-6 h-6 text-blue-500 mt-1" />
                          <div className="flex flex-col w-full">
                            <span className="font-semibold flex items-center justify-between text-sm">
                              { n.author.id === user._id ? "Eu" : n.author.nome } <MoveHorizontal />{" "}
                              {n.tipo === "pessoa" ? (
                                <span>
                                  {typeof n.receptor === "object"
                                    ? n.receptor?.nome
                                    : "Desconhecido"}
                                </span>
                              ) : (
                                <span>
                                  {typeof n.receptor === "string"
                                    ? n.receptor
                                    : "Desconhecido"}
                                </span>
                              )}
                            </span>
                            <span className="text-sm text-gray-600">
                              {n.conteudo}
                            </span>
                          </div>
                        </div>
                      ))
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </>
          )}
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
