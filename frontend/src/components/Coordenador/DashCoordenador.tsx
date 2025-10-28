import { useCoordenador } from "@/contexts/coordenadorContext"
import { Navbar } from "../Navbar/Navbar"
import { Card } from "@/components/Dasboard/DashboardCards"

import { FaChalkboardTeacher, FaGraduationCap } from "react-icons/fa";
import { IoBookSharp } from "react-icons/io5";
import { SiGoogleclassroom } from "react-icons/si";

// Importação dos icones para o dashboard.
// import Class from "../../assets/Icons/Class.png" 
// import GraduationCap from "../../assets/Icons/GraduationCap.png"
// import Teacher from "../../assets/Icons/Teacher.png"
// import School from "../../assets/Icons/School.png"

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
    <div className="flex flex-col h-full gap-15 pt-[1vw] ">
      {/* <Navbar /> */}
      <div>
        <div className="flex flex-col gap-10 mb-10">
          <span className="flex items-center justify-center text-[2vw]">Visão Geral</span>
          <div className="flex flex-row flex-wrap gap-20 justify-center">
            <Card icon={FaGraduationCap} title={"Alunos"} valueText={overview?.totalAlunos} />
            <Card icon={FaChalkboardTeacher} title={"Professores"} valueText={overview?.totalProfessores ?? null} />
            <Card icon={IoBookSharp} title={"Disciplinas"} valueText={overview.totalDisciplinas ?? null} />
            <Card icon={SiGoogleclassroom} title={"Turmas"} valueText={overview.totalTurmas ?? null} />
          </div>
          <div className="flex flex-row flex-wrap gap-20 justify-center">
            <Card icon={FaGraduationCap} title={"Alunos"} valueText={overview?.totalAlunos} />
            <Card icon={FaChalkboardTeacher} title={"Professores"} valueText={overview?.totalProfessores ?? null} />
            <Card icon={IoBookSharp} title={"Disciplinas"} valueText={overview.totalDisciplinas ?? null} />
            <Card icon={SiGoogleclassroom} title={"Turmas"} valueText={overview.totalTurmas ?? null} />
          </div>
        </div>

      </div>
    </div>
  )
}