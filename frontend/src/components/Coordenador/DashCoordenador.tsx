import { useCoordenador } from "@/contexts/coordenadorContext"
import { Navbar } from "../Navbar/Navbar"
import { GraduationCap, Import, UserRoundPen, BookOpen, Users } from "lucide-react"
import { Card } from "@/components/Dasboard/DashboardCards"

export const DashCoordenador = () => {

  const { overview } = useCoordenador()

  if (!overview) {
    return (
      <div className="flex items-center justify-center h-full">
        <span>Carregando...</span>
      </div>
    )
  }


  return (
    <div className="flex flex-col h-full ">

      <Navbar />
      <div>

        <div className="flex flex-col gap-10">
          <span className="flex items-center justify-center text-[2vw]">Visão Geral</span>
          <div className="grid grid-cols-2 gap-20">
            <Card icon={GraduationCap} title={"Alunos"} valueText={overview?.totalAlunos} />
            <Card icon={UserRoundPen} title={"Professores"} valueText={overview?.totalProfessores ?? null} />
            <Card icon={BookOpen} title={"Disciplinas"} valueText={overview.totalDisciplinas ?? null} />
            <Card icon={Users} title={"Turmas"} valueText={overview.totalTurmas ?? null} />
          </div>
        </div>

        <div>

        </div>

      </div>
    </div>
  )
}