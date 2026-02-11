import * as React from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useCoordenador } from "@/contexts/coordenadorContext";
import { Spinner } from "@/components/ui/spinner";
import { useAuth } from "@/contexts/authContext";
import { useEffect } from "react";
import { useState } from "react";
import { Events } from "@/components/CalendarData/CalendarData";
import { EventsData } from "@/components/CalendarData/EventsData";

type TipoEvento = "feriado" | "reunião" | "aviso" | "férias" | "prova";

interface EventForm {
  titulo: string;
  descricao: string;
  tipo: TipoEvento;
}

export interface IEvent {
  _id?: string;
  titulo: string;
  descricao: string;
  tipo: string;
  data: string;
}

export function AcademicCalendar() {
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(
    new Date()
  );
  const [open, setOpen] = useState(false);

  const { registerEvent, loading } = useCoordenador();
  const { listEvents, setEvents } = useAuth();

  const { register, handleSubmit, reset, setValue } = useForm<EventForm>();

  //Função para criar um novo evento
  const onSubmit = async (data: EventForm) => {
    if (!selectedDate) return;

    try {
      await registerEvent(data.titulo, data.descricao, selectedDate, data.tipo);
      toast.success("Evento cadastrado com sucesso!");
      setEvents((prev) => [
        ...prev,
        {
          titulo: data.titulo,
          descricao: data.descricao,
          tipo: data.tipo,
          data: selectedDate.toISOString(),
        },
      ]);
      reset();
      setOpen(false);
    } catch (error) {
      toast.error("Erro ao cadastrar evento.");
    }
  };

  //Função para listar eventos
  useEffect(() => {
    console.log("Carregando eventos...");
    const fetchEvents = async () => {
      try {
        const data = await listEvents();
        setEvents(data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchEvents();
  }, []);

  return (
    <div className="flex flex-col justify-center items-center">
      <h1 className="text-center p-5 text-2xl font-bold">
        Registro de eventos
      </h1>

      <EventsData />

      <div className="flex-col md:flex-row flex w-full gap-5 justify-around items-center">
        <div className="flex flex-col items-center justify-center">
          <h1 className="mb-3">Registro de eventos</h1>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(date) => {
              setSelectedDate(date);
              setOpen(true);
            }}
            className="rounded-md border shadow-sm"
            captionLayout="dropdown"
          />
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Cadastrar Evento</DialogTitle>
              <DialogDescription>
                Preencha as informações abaixo para adicionar um novo evento ao
                calendário acadêmico.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
              <div>
                <Label>Título</Label>
                <Input
                  {...register("titulo", { required: true })}
                  placeholder="Ex: Reunião de pais"
                />
              </div>
              <div>
                <Label>Descrição</Label>
                <Textarea
                  {...register("descricao")}
                  placeholder="Detalhes do evento"
                />
              </div>
              <div>
                <Label>Tipo</Label>
                <Select
                  onValueChange={(value) => setValue("tipo", value as TipoEvento)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="feriado">Feriado</SelectItem>
                    <SelectItem value="reunião">Reunião</SelectItem>
                    <SelectItem value="aviso">Aviso</SelectItem>
                    <SelectItem value="férias">Férias</SelectItem>
                    <SelectItem value="prova">Prova</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="pt-2 flex justify-end">
                <Button className="cursor-pointer" type="submit">
                  {loading ? (
                    <span className="flex justify-center items-center gap-2">
                      <Spinner /> Carregando...
                    </span>
                  ) : (
                    <span>Cadastrar</span>
                  )}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
        
        {/* Calendário de eventos */}
        <div className="h-100 flex justify-center items-center">
          <Events />
        </div>
      </div>
    </div>
  );
}
