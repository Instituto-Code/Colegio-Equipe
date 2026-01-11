"use client";

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { useCoordenador } from "@/contexts/coordenadorContext";

interface ChartProps {
    title: string
}

export function ChartQuantity({ title }: ChartProps) {
  const { overview } = useCoordenador();

  const chartConfig = {
    total: {
      label: "Quantidade",
      color: "#2563eb",
    },
  } satisfies ChartConfig;

  const chartData = overview
    ? [
        { label: "Alunos", total: overview.totalAlunos },
        { label: "Professores", total: overview.totalProfessores },
        { label: "Disciplinas", total: overview.totalDisciplinas },
        { label: "Turmas", total: overview.totalTurmas },
      ]
    : [];
  return (
    <div>
        <h1 className="font-bold my-3 mx-3.5">{title}</h1>
        <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
        
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="label"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="total" fill="var(--color-total)" radius={6} />
          </BarChart>
        </ChartContainer>
    </div>
  );
}
