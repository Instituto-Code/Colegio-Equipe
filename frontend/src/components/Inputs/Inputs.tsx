interface IProps{
    title: string,
    type?: "password" | "email" | "text",
    name: string,
    value: string,
    onChange: React.ChangeEventHandler<HTMLInputElement>,
    placeHolder?: string
}

// Inputs para páginas de autenticação de usuário.
export const InputAuth = ({ title, type, name, value, onChange, placeHolder }: IProps) => {
    return (
        <div className="flex flex-col">
            <p className="font-[Inter] font-[400] text-[0.8em] my-[0.5vw]">
                {title}
            </p>
            <input
                placeholder={placeHolder}
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                className=" indent-[5px] h-[4vh] w-full rounded-[8px] border-none bg-[#F2F2F2] focus:outline-none"
            />
        </div>
    )

}