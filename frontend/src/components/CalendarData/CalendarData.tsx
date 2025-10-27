
import * as React from "react";
import { Calendar } from "@/components/ui/calendar";
import { useAuth } from "@/contexts/authContext";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type TipoEvento = "feriado" | "reunião" | "aviso" | "férias" | "prova";

export interface IEvent {
  _id?: string;
  titulo: string;
  descricao?: string;
  tipo: TipoEvento;
  data: Date; 
}

export function Events() {
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>();
  const { events, listEvents } = useAuth();

  // Carrega eventos do contexto 
  React.useEffect(() => {
    listEvents().catch(console.error);
  }, [listEvents]);

  const normalized = React.useMemo(() => {
    return (events || []).map((e) => ({
      ...e,
      data: e instanceof Date ? e.data : new Date(e.data),
    })) as IEvent[];
  }, [events]);

  // Agrupar por tipo arrays de Date (pra modifiers)
  const feriados = normalized.filter((e) => e.tipo === "feriado").map((e) => e.data);
  const provas = normalized.filter((e) => e.tipo === "prova").map((e) => e.data);
  const avisos = normalized.filter((e) => e.tipo === "aviso").map((e) => e.data);
  const reunioes = normalized.filter((e) => e.tipo === "reunião").map((e) => e.data);
  const ferias = normalized.filter((e) => e.tipo === "férias").map((e) => e.data);

  // Busca eventos do dia
  const getEventsOfDay = (day: Date) =>
    normalized.filter((e) => e.data.toDateString() === day.toDateString());

  // Função para extrair Date de props do Day
  function extractDateFromDayProps(props: any): Date | null {

    if (!props) return null;
    if (props.date instanceof Date) return props.date;
    if (props.day) {
      
      if (props.day.date instanceof Date) return props.day.date;
      
      if (props.day instanceof Date) return props.day;
      
      if (typeof props.day === "string") return new Date(props.day);
    }

    return null;
  }

  return (
    <div className="flex flex-col items-center p-6 gap-4">
      
      <TooltipProvider delayDuration={80000}>
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={setSelectedDate}
          className="rounded-md border shadow-sm"
          captionLayout="dropdown"
          modifiers={{
            feriado: feriados,
            prova: provas,
            aviso: avisos,
            reunião: reunioes,
            férias: ferias,
          }}
          modifiersClassNames={{
            feriado: "bg-red-500 text-white hover:bg-red-600",
            prova: "bg-blue-500 text-white hover:bg-blue-600",
            aviso: "bg-yellow-400 text-black hover:bg-yellow-500",
            reunião: "bg-green-500 text-white hover:bg-green-600",
            férias: "bg-orange-500 text-white hover:bg-orange-600",
          }}
          
          components={{
            Day: (props: any) => {
              // extrai a data do props de forma segura
              const date = extractDateFromDayProps(props) ?? props; 
              const dayDate: Date | null =
                date instanceof Date ? date : null;

              const dayEvents = dayDate ? getEventsOfDay(dayDate) : [];

              if (!dayDate || dayEvents.length === 0) {
                return <div {...props}>{dayDate ? dayDate.getDate() : props.children}</div>;
              }

              // se tiver evento, mostrar tooltip
              return (
                <Tooltip key={dayDate.toISOString()}>
                  <TooltipTrigger asChild>
                    <div
                      {...props}
                      className="relative flex items-center justify-center w-full h-full rounded-md cursor-pointer"
                    >
                      {dayDate.getDate()}
                      {/* indicador pontinho colorido */}
                      <span
                        className={`absolute bottom-1 w-2 h-2 rounded-full ${
                          dayEvents[0].tipo === "feriado"
                            ? "bg-red-500"
                            : dayEvents[0].tipo === "prova"
                            ? "bg-blue-500"
                            : dayEvents[0].tipo === "aviso"
                            ? "bg-yellow-400"
                            : dayEvents[0].tipo === "reunião"
                            ? "bg-green-500"
                            : "bg-orange-500"
                        }`}
                      />
                    </div>
                  </TooltipTrigger>

                  <TooltipContent side="top" className="bg-white text-black shadow-md p-2 rounded-md">
                    <div className="space-y-1 text-sm">
                      {dayEvents.map((e, i) => (
                        <div key={e._id ?? `${i}-${e.titulo}`}>
                          <strong>{e.titulo}</strong> — <span className="capitalize">{e.tipo}</span>
                          {e.descricao ? <div className="text-xs text-muted-foreground">{e.descricao}</div> : null}
                        </div>
                      ))}
                    </div>
                  </TooltipContent>
                </Tooltip>
              );
            },
          }}
        />
      </TooltipProvider>

      {selectedDate && (
        <div className="w-full max-w-md mt-4 p-3 border rounded-lg bg-muted/30">
          <h3 className="font-semibold mb-2">Eventos de {selectedDate.toLocaleDateString("pt-BR")}</h3>
          {getEventsOfDay(selectedDate).length > 0 ? (
            <ul className="space-y-2">
              {getEventsOfDay(selectedDate).map((e) => (
                <li key={e._id ?? e.titulo} className="p-2 border-l-4 bg-white shadow-sm rounded-md text-sm"
                    style={{
                      borderColor:
                        e.tipo === "feriado"
                          ? "#ef4444"
                          : e.tipo === "prova"
                          ? "#3b82f6"
                          : e.tipo === "aviso"
                          ? "#facc15"
                          : e.tipo === "reunião"
                          ? "#22c55e"
                          : "#fb923c",
                    }}>
                  <strong>{e.titulo}</strong> — {e.descricao}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted-foreground text-sm">Nenhum evento neste dia.</p>
          )}
        </div>
      )}
    </div>
  );
}
