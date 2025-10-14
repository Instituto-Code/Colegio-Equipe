interface IButton{
    type: "submit" | "button"
    nomeBtn: string
}


// Botão para páginas de autenticação do usuário.
export const ButtonAuth = ({ type, nomeBtn }: IButton) => {
    return (
        <div className='flex items-center justify-center'>
            <button
                type={type}
                className='className=" flex  items-center  justify-center  w-[70%]  text-[1em]  font-[var(--font-1)]  bg-[#303A73]  text-white  border-none  rounded-[5px]  p-[10px]  cursor-pointer hover:opacity-90 transition'
            >
                {nomeBtn}
            </button>
        </div>
    )
}