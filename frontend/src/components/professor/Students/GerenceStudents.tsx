import { Input } from "@/components/ui/input"

export const GerenciarAlunos = () => {
    return (
        <div className="m-5 p-6 md:p-10">
            <div>
                <h1 className="text-3xl font-bold mb-5">Meus Alunos</h1>
            </div>

            <Input
                type="text"
                placeholder="Buscar Turmas..."
                // value={globalFilter ?? ""}
                // onChange={(e) => setGlobalFilter(e.target.value)}
                className="p-2 my-3.5 md:my-0 border rounded w-full max-w-sm"
            />

        </div>
    )
}
