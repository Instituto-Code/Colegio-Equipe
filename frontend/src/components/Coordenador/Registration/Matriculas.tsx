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
import { toast, Toaster } from "sonner"
import React, { useEffect, useState } from "react"
import { useAuth } from "@/contexts/authContext"
import { Spinner } from "@/components/ui/spinner";
import { Input } from "@/components/ui/input";
import { MenuParents } from "./Tools";
import { Trash } from "lucide-react";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

// Interface para os dados do aluno.
export interface IAluno {
    id: string
    nome: string
    matricula: string
    cpf: string,
    dataNasc: Date,
    sexo: "masculino" | "feminino"
    status: string
}

export const Matriculas = () => {

    const [loading, setLoading] = useState(false);
    const [data, setData] = React.useState<IAluno[]>([])
    const [globalFilter, setGlobalFilter] = useState("")
    const [sorting, setSorting] = useState<SortingState>([]);
    const [openAssStudent, setOpenAssStudent] = useState(false)
    const [openDelete, setOpenDelete] = useState(false)
    const [studentToDelete, setStudentToDelete] = useState<string | null>(null)

    const { Alunos, registerStudent } = useCoordenador()

    const { token } = useAuth()

    // Carregamento da lista de alunos, carrega novamente ao adicionar um novo aluno.
    useEffect(() => {
        const getAlunos = async () => {
            setLoading(true)
            try {
                const res = await fetch(`${api_url}/api/coordenador/list-students`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
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
    }, [registerStudent])


    // Colunas da tabela
    const columns = (
        onDelete: (idStudent: string) => void
    ): ColumnDef<IAluno>[] => [
            { accessorKey: "nome", header: "Nome" },
            { accessorKey: "matricula", header: "Matrícula" },
            { accessorKey: "status", header: "Status" },
            {
                id: "actions",
                cell: ({ row }) => (
                    <div className="flex gap-2">
                        <MenuParents openDialog={openAssStudent} idAluno={row.original.id} nome={row.original.nome} />
                        <Button
                            onClick={() => {
                                setOpenDelete(true)
                                setStudentToDelete(row.original.id)
                            }
                        }
                            variant={"outline"}
                            className="cursor-pointer text-red-500">
                            Excluir
                        </Button>
                    </div>
                ),
            },
        ];

    // Rota para deletar um aluno
    const deleteStudent = async (idStudent: string) => {
        setLoading(true)
        try {
            const res = await fetch(`${api_url}/api/coordenador/delete-student/${idStudent}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            const data = await res.json()

            if (!res.ok) {
                toast.error("Não foi possível excluir o aluno")
                throw new Error(data.error)
            }

            toast.success("Aluno excluido com sucesso")
            setData((prev) => prev.filter((student) => student.id !== idStudent))
        }
        catch (error: any) {
            console.error(error)
        }
        finally {
            setLoading(false)
        }
    }

    // Mapeando a tabela
    const table = useReactTable({
        columns: columns(deleteStudent),
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

                {/* Input para a busca de alunos */}
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
                        <ScrollArea className="w-full ">
                            <Table className="w-full">
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
                                <MenuParents openDialog={openAssStudent} idAluno={row.original.id} nome={row.original.nome} />
                            </div>
                        </div>
                    ))}

                </div>

                <Toaster />

                {/* Modal para confirmar a exclusão do aluno */}
                <Dialog open={openDelete} onOpenChange={setOpenDelete}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Confirmar exclusão</DialogTitle>
                        </DialogHeader>

                        <p>Tem certeza que deseja excluir este registro?</p>

                        <DialogFooter>
                            <DialogClose asChild>
                                <Button variant="outline">Cancelar</Button>
                            </DialogClose>

                            <Button
                                variant="destructive"
                                onClick={() => {
                                    if(studentToDelete){
                                        deleteStudent(studentToDelete)
                                        setStudentToDelete(null)
                                        setOpenDelete(false)
                                    }
                                }}
                            >
                                Excluir
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

            </div>
        </div>
    )
}