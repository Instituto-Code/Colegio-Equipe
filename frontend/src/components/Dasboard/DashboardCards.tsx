interface Card {
    icon: React.ComponentType | null
    title: string | null
    valueText: number | null
}


export const Card = ({ title, icon: Icon, valueText,  }: Card) => {
    return (
        <div className="flex flex-col items-center bg-blue-400 ">
            <div className="flex flex-row-reverse gap-1 text-[1.9vw] justify-center items-center">
                <span>{title}</span>
                {Icon && <Icon/>}
            </div>
            <div className="text-[1.9vw]">
                {valueText}
            </div>

        </div>
    )
}