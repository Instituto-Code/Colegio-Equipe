import type React from "react"

interface Card {
    icon: React.ComponentType<{ size: number }> | string | null
    title: string | null
    valueText: number | null
}

export const Card = ({ title, icon: Icon , valueText  }: Card) => {
    return (
        <div className="flex flex-col items-center p-15 bg-blue-400 ">
            <div className="flex gap-10 text-[clamp(2vw,2.5vw,4vw)] justify-center items-center">
                <div>
                    {Icon && <Icon size={90} />}
                </div>
                <div className="flex flex-col items-center">
                    <span>{title}</span>
                    <span>{valueText}</span>
                </div>
            </div>

        </div>
    )
}