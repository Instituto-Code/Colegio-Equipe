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
import { useEffect, useState } from "react";
import { axiosInstance } from "@/api/axiosInstance";
import { useAuth } from "@/contexts/authContext";

interface ChartQuantityByClassProps {
    title: string
}

export function ChartQuantityByClass({ title }: ChartQuantityByClassProps) {
  const { token } = useAuth();

  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    const fetchStudentByClass = async () => {
      const res = await axiosInstance.get("/api/coordenador/student-by-class", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setData(res.data);

      console.log(res);
    };

    fetchStudentByClass();
  }, []);

  const chartData = data.map((item) => ({
    turma: `${item.turma} (${item.turno})`,
    alunos: item.totalAlunos,
  }));

  const chartConfig = {
    alunos: {
      label: "Alunos",
      color: "#2563eb",
    },
  } satisfies ChartConfig;

  return (
    <div>
        <h1 className="font-bold my-3 mx-3.5">{title}</h1>
        <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
          <BarChart data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="turma"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="alunos" fill="var(--color-alunos)" radius={6} />
          </BarChart>
        </ChartContainer>
    </div>
  );
}
