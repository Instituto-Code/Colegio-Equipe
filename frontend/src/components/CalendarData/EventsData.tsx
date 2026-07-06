export const EventsData = () => {
  return (
    <ul className="grid grid-cols-2 md:flex flex-wrap gap-2 md:gap-4">
      <li className="flex justify-center items-center gap-2 md:gap-3 border-2 p-2 md:p-3 rounded-lg">
        Feriado: <span className="bg-red-500 rounded-full h-2 w-2 md:h-3 md:w-3"></span>
      </li>
      <li className="flex justify-center items-center gap-2 md:gap-3 border-2 p-2 md:p-3 rounded-lg">
        Reunião: <span className="bg-green-500 rounded-full h-2 w-2 md:h-3 md:w-3"></span>
      </li>
      <li className="flex justify-center items-center gap-2 md:gap-3 border-2 p-2 md:p-3 rounded-lg">
        Férias: <span className="bg-orange-500 rounded-full h-2 w-2 md:h-3 md:w-3"></span>
      </li>
      <li className="flex justify-center items-center gap-2 md:gap-3 border-2 p-2 md:p-3 rounded-lg">
        Prova: <span className="bg-blue-500 rounded-full h-2 w-2 md:h-3 md:w-3"></span>
      </li>
      <li className="flex justify-center items-center gap-2 md:gap-3 border-2 p-2 md:p-3 rounded-lg">
        Aviso: <span className="bg-yellow-400 rounded-full h-2 w-2 md:h-3 md:w-3"></span>
      </li>
    </ul>
  )
}
