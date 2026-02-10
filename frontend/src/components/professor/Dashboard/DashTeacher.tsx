import { useEffect } from "react"
import { MetricCard } from "./Cards"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useTeach } from "@/contexts/teacherContext"
import {
    BookOpen,
    GraduationCap,
    Users,
    RefreshCw,
    Eye,
    Settings2,
} from "lucide-react"

// Dashboard do coordenador
export const DashTeacher = () => {

    const { listClasses, alunos, turmas, disciplinas, loading, setLoading } = useTeach()

    // Efeito para carregar os dados do professor
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
            try {
                await listClasses()
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [])

    return (
        <div className="flex w-full flex-col gap-8 px-8 py-8 md:px-10 lg:px-16 max-w-7xl mx-auto">

            <div className="flex flex-col gap-1">
                <p className="text-sm font-medium text-muted-foreground tracking-wide uppercase">
                    Visão geral
                </p>
                <h1 className="text-3xl font-bold tracking-tight">
                    Dashboard do Professor
                </h1>
                <p className="text-muted-foreground mt-1">
                    Acompanhe rapidamente suas turmas e os alunos vinculados.
                </p>
            </div>

            {/* Metric Cards */}
            <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <MetricCard
                    title="Meus Alunos"
                    valueText={alunos.length}
                    icon={Users}
                    variant="blue"
                    loading={loading}
                />
                <MetricCard
                    title="Minhas Turmas"
                    valueText={turmas.length}
                    icon={GraduationCap}
                    variant="teal"
                    loading={loading}
                />
                <MetricCard
                    title="Disciplinas"
                    valueText={disciplinas.length}
                    icon={BookOpen}
                    variant="amber"
                    loading={loading}
                />
            </section>
            
            {/* Quick Actions */}
            <Card className="shadow-sm">
                <CardHeader className="pb-3">
                    <CardTitle className="text-lg font-semibold">Atalhos rápidos</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-3">
                    <Button
                        variant="outline"
                        className="gap-2"
                        onClick={() => {listClasses()}}
                    >
                        <RefreshCw className="h-4 w-4" />
                        Atualizar dados
                    </Button>
                    <Button className="gap-2">
                        <Eye className="h-4 w-4" />
                        Ver turmas
                    </Button>
                    <Button variant="secondary" className="gap-2">
                        <Settings2 className="h-4 w-4" />
                        Gerenciar alunos
                    </Button>
                </CardContent>
            </Card>
        </div>
    )
}