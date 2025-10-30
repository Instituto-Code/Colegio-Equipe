import {
    type ColumnDef,
    type ColumnFiltersState,
    type SortingState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table"


import { Modal } from "./ModalDesc"
import { api_url, useCoordenador } from "@/contexts/coordenadorContext";
import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { AddStudent } from "./AddStudent"
import { Toaster } from "sonner"
import React, { useEffect, useState } from "react"
import { useAuth } from "@/contexts/authContext"
import { Spinner } from "@/components/ui/spinner";
import { Input } from "@/components/ui/input";
import { ModalEdit } from "./ModalEdit";


interface Aluno {
    nome: string
    matricula: string
    cpf: string,
    dataNasc: Date,
    sexo: "masculino" | "feminino"
    status: string
}

export const Matriculas = () => {

    const [loading, setLoading] = useState(false);
    const [data, setData] = React.useState<Aluno[]>([])
    const [globalFilter, setGlobalFilter] = useState("")
    const [sorting, setSorting] = useState<SortingState>([]);
    const [selectedAluno, setSelectedAluno] = useState<Aluno | null>(null)
    const [modalEdit, setModalEdit] = useState(false)

    const { alunos, registerStudent } = useCoordenador()
    
    console.log(alunos)

    const { token } = useAuth()

    useEffect(() => {
        const getAlunos = async () => {
            setLoading(true)
            try {
                const res = await fetch(`${api_url}/api/coordenador/list-students`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })

                const dataJson = await res.json()

                setData(dataJson.alunos)
                console.log(dataJson.alunos)
            }
            catch (error) {
                console.error(error)
            }
            finally {
                setLoading(false)
            }

        }
        getAlunos()
        console.log("RegisterStudents foi chamado")
    }, [registerStudent])


    // Colunas da tabela
    const columns: ColumnDef<Aluno>[] = [
        { accessorKey: "nome", header: "Nome" },
        { accessorKey: "matricula", header: "Matrícula" },
        { accessorKey: "status", header: "Status" },
        {
            id: "actions",
            header: "Ações",
            cell: ({ row }) => (
                <div className="flex gap-2">
                    <Button
                        onClick={() => {
                            setSelectedAluno(row.original)
                            setModalEdit(true)
                            console.log("click", modalEdit)
                        }}
                        className="bg-blue-400 hover:bg-blue-500 cursor-pointer">
                        Editar
                    </Button>
                </div>
            ),
        },
    ];

    // Mapeando a tabela
    const table = useReactTable({
        columns,
        data,
        getCoreRowModel: getCoreRowModel(),
        state: {
            globalFilter,
            sorting
        },
        onGlobalFilterChange: setGlobalFilter,
        onSortingChange: setSorting,
        getFilteredRowModel: getFilteredRowModel(), //client side filtering
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    })

    return (
        <div className="flex flex-col  h-full ">
            {/* Cabeçalho da tabela */}
            <div className="mt-5 p-10">
                <div className="flex flex-col md:flex-row justify-between">
                    <h1 className="text-3xl font-bold mb-3">Gerenciar Matrículas</h1>
                    <AddStudent />
                </div>

                <Input
                    type="text"
                    placeholder="Buscar Alunos..."
                    value={globalFilter ?? ""}
                    onChange={(e) => setGlobalFilter(e.target.value)}
                    className="p-2 my-3.5 md:my-0 border rounded w-full max-w-sm"
                />

                <div className="overflow-x-auto hidden py-5 md:flex">
                    {loading ? (
                        <div className="h-100 w-full flex flex-col justify-center items-center">
                            <Spinner className="size-8 text-blue-500" />
                        </div>
                    ) : (
                        // Tabela para Computador
                        <ScrollArea className="w-full">
                            <Table className="w-full">
                                {/* <TableCaption>A list of your recent invoices.</TableCaption> */}
                                <TableHeader>
                                    {table.getHeaderGroups().map((headerGroup) => (
                                        <TableRow key={headerGroup.id}>
                                            {headerGroup.headers.map((header) => (
                                                <TableHead key={header.id}>
                                                    <button
                                                        className="cursor-pointer "
                                                        onClick={header.column.getToggleSortingHandler()}
                                                    >
                                                        {header.isPlaceholder
                                                            ? null
                                                            : flexRender(
                                                                header.column.columnDef.header,
                                                                header.getContext()
                                                            )}
                                                        {{
                                                            asc: "🔼",
                                                            desc: "🔽",
                                                        }[header.column.getIsSorted() as string] ?? null}
                                                    </button>
                                                </TableHead>
                                            ))}
                                        </TableRow>
                                    ))}
                                </TableHeader>
                                <TableBody>
                                    {table.getRowModel().rows.map((row) => (
                                        <TableRow key={row.id}>
                                            {row.getVisibleCells().map(cell => (
                                                <TableCell key={cell.id}>
                                                    {flexRender(
                                                        cell.column.columnDef.cell,
                                                        cell.getContext()
                                                    )}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    ))}
                                </TableBody>
                                {/* <TableFooter>
                                <TableRow>
                                    <TableCell colSpan={3}>Total</TableCell>
                                    <TableCell className="text-right">$2,500.00</TableCell>
                                </TableRow>
                            </TableFooter> */}
                            </Table>
                        </ScrollArea>
                        
                    )}
                </div>

                {/* Tabela para celulares */}
                <div className="block sm:hidden space-y-2">
                    {table.getRowModel().rows.map((row) => (
                        <div className="border p-2 rounded">
                            <div>
                                <strong>Nome: </strong>{row.original.nome}
                            </div>
                            <div>
                                <strong>Matrícula: </strong>{row.original.matricula}
                            </div>
                            <div>
                                <strong>Status: </strong>{row.original.status}
                            </div>
                            <div className="flex mt-2">
                                <Button 
                                onClick={()=> setModalEdit(true)}
                                className="bg-blue-400 hover:bg-blue-500 cursor-pointer">
                                    Editar
                                </Button>
                            </div>
                        </div>
                    ))}

                </div>

                {modalEdit && (
                    <ModalEdit
                        onClose={() => setModalEdit(false)}
                    />
                )}


                <Toaster />
            </div>
        </div>
    )
}