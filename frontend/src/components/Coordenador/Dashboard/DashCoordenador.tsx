import { useCoordenador } from "@/contexts/coordenadorContext"
import { Navbar } from "../../Navbar/Navbar"
import { Card } from "@/components/Coordenador/Dashboard/DashboardCards"

import { FaChalkboardTeacher, FaGraduationCap } from "react-icons/fa";
import { IoBookSharp } from "react-icons/io5";
import { SiGoogleclassroom } from "react-icons/si";
import { Spinner } from "@/components/ui/spinner";

// Importação dos icones para o dashboard.
// import Class from "../../assets/Icons/Class.png" 
// import GraduationCap from "../../assets/Icons/GraduationCap.png"
// import Teacher from "../../assets/Icons/Teacher.png"
// import School from "../../assets/Icons/School.png"

export const DashCoordenador = () => {

  const { overview, loading } = useCoordenador()

  if (!overview) return


  return (
    <div className="flex flex-col h-full gap-15 max-sm:pt-[12vw] ">
      {/* <Navbar /> */}
      {
        overview === null && loading ? (
          <Spinner className="size-8 text-blue-500" />
        ) : (
          <div className="flex h-full flex-col">
            <div className="h-full md:h-auto">
              <img className="flex h-full md:h-auto opacity-20 top-28 absolute z-10" src="/school.svg" alt="" />
            </div>
          <span className="flex items-center justify-center text-[6vw] md:text-[3vw]">Visão Geral</span>
          <div className="flex z-20 flex-col gap-3.5 md:gap-0 h-full items-center md:flex-row flex-wrap justify-around">
            <Card type="alunos" icon={FaGraduationCap} title={"Alunos"} valueText={overview?.totalAlunos} />
            <Card type="professores" icon={FaChalkboardTeacher} title={"Professores"} valueText={overview?.totalProfessores ?? null} />
            <Card type="disciplinas" icon={IoBookSharp} title={"Disciplinas"} valueText={overview.totalDisciplinas ?? null} />
            <Card type="turmas" icon={SiGoogleclassroom} title={"Turmas"} valueText={overview.totalTurmas ?? null} />
          </div>
          
        </div>
        )
      }
        

      
    </div>
  )
}