import type React from "react"

interface Card {
    icon: React.ComponentType<{ size: number | string }> | string | null
    title: string | null
    valueText: number | null
    type: string
}

export const Card = ({ title, icon: Icon , valueText, type  }: Card) => {

const styleCard = 
  type === "Minha turma" ? 
    "bg-[#1E40AF]" :
  type === "" ? 
    "bg-[#0F766E]" : 
  type === "disciplinas" ? 
    "bg-[#15803D]" : 
  type === "turmas" ?
    "bg-[#C2410C]" : 
    "";


    return (
        <div className={`flex w-[80%] ${styleCard} opacity-80 md:w-[40%] flex-col items-center p-5 border-gray-300 border-2 rounded-2xl shadow-md text-gray-800}`}>
            <div className={`flex md:gap-10 text-slate-50 text-[clamp(2vw,2.5vw,4vw)] justify-center items-center`}>
                <div className="w-10 lg:w-25">
                    {Icon && <Icon size={"100%"} />}
                </div>
                <div className="flex flex-col items-center">
                    <span className="text-[6vw] md:text-[3vw]">{title}</span>
                    <span className="text-[6vw] md:text-[3vw]" >{valueText}</span>
                </div>
            </div>

        </div>
    )
}