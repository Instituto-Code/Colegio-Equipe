import * as React from "react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ISelectProps {
  type: "pessoa" | "grupo";
  setType: (value: "pessoa" | "grupo") => void;
  target: string | null;
  setTarget: (value: string) => void;
}

export function SelectType({ type, setType, target, setTarget }: ISelectProps) {
  return (
    <>
      {type === "pessoa" ? (
        <Select value={target || ""} onValueChange={setTarget}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Selecione uma pessoa" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="aluno1">Aluno 1</SelectItem>
            <SelectItem value="professor1">Professor 1</SelectItem>
          </SelectContent>
        </Select>
      ) : (
        <Select value={target || ""} onValueChange={setTarget}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Selecione um grupo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="professores">Professores</SelectItem>
            <SelectItem value="alunos">Alunos</SelectItem>
          </SelectContent>
        </Select>
      )}
    </>
  );
}
