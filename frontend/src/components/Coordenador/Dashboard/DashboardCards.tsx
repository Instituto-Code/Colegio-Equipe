import type React from "react"

interface Card {
    icon: React.ComponentType<{ size: number | string }> | string | null
    title: string | null
    valueText: number | null
}

export const Card = ({ title, icon: Icon , valueText  }: Card) => {
    return (
        <div className="flex w-[80%] md:w-[40%] flex-col items-center p-5 border-gray-300 border-2 rounded-2xl shadow-md text-gray-800">
            <div className="flex md:gap-10 text-[clamp(2vw,2.5vw,4vw)] justify-center items-center">
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