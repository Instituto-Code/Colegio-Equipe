import { useState, useEffect } from "react";
import { Send } from "lucide-react";
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
import { api_url } from "@/contexts/coordenadorContext";
import { useAuth } from "@/contexts/authContext";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";

interface INotificationsProps {
  open: boolean;
  onOpenChange: (value: boolean) => void;
}

export function NotificationsSend({ open, onOpenChange }: INotificationsProps) {
  const [type, setType] = useState<"pessoa" | "grupo">("pessoa");
  const [target, setTarget] = useState<string | null>(null);
  const [conteudo, setConteudo] = useState("");
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const { token } = useAuth();

  //Busca usuários do backend (quando for "pessoa")
  useEffect(() => {
    if (type === "pessoa") {
      fetch(`${api_url}/api/coordenador/list-users`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => setUsers(data.users))
        .catch(console.error);
    }
  }, [type]);

  const handleSubmit = async () => {
    setLoading(true);

    try {
      if (!conteudo || !type || (!target && type === "pessoa"))
        return alert("Preencha todos os campos!");

      const body =
        type === "pessoa"
          ? { conteudo, tipo: "pessoa", pessoa: target }
          : { conteudo, tipo: "grupo", grupo: target };


        console.log(body)

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
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Enviar Notificações</DialogTitle>
          <DialogDescription>
            Envie mensagens para um usuário específico ou um grupo inteiro.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="enviar">
          <TabsList>
            <TabsTrigger value="enviar">Mensagem</TabsTrigger>
            <TabsTrigger value="enviadas">Enviadas</TabsTrigger>
          </TabsList>

          {/* ABA DE ENVIAR */}
          <TabsContent value="enviar">
            <Card>
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
                          <SelectItem value="pendente">Pendentes</SelectItem>
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
                  {loading ? (
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
            <Card>
              <CardContent>
                <p>Nenhuma mensagem enviada...</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
