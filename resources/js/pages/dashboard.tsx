import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
    ClipboardList, 
    CheckCircle2, 
    Clock, 
    AlertCircle,
    TrendingUp,
    Calendar,
    Users,
    FileText
} from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

interface DashboardProps {
    stats: {
        total_audits: number;
        completed_audits: number;
        in_progress_audits: number;
        scheduled_audits: number;
        completion_rate: number;
    };
    recent_audits: Array<{
        id: number;
        title: string;
        status: 'scheduled' | 'downloaded' | 'in_progress' | 'completed' | 'cancelled';
        assigned_to: {
            name: string;
        };
        scheduled_date: string;
        completed_at: string | null;
    }>;
    upcoming_audits: Array<{
        id: number;
        title: string;
        assigned_to: {
            name: string;
        };
        scheduled_date: string;
    }>;
}

const statusConfig = {
    scheduled: { label: 'Programada', variant: 'outline' as const, color: 'text-blue-600' },
    downloaded: { label: 'Descargada', variant: 'secondary' as const, color: 'text-purple-600' },
    in_progress: { label: 'En Progreso', variant: 'default' as const, color: 'text-yellow-600' },
    completed: { label: 'Completada', variant: 'secondary' as const, color: 'text-green-600' },
    cancelled: { label: 'Cancelada', variant: 'destructive' as const, color: 'text-red-600' },
};

export default function Dashboard({ stats, recent_audits = [], upcoming_audits = [] }: DashboardProps) {
    const statCards = [
        {
            title: 'Total de Auditorías',
            value: stats?.total_audits || 0,
            icon: ClipboardList,
            description: 'Auditorías registradas',
            color: 'text-blue-600',
            bgColor: 'bg-blue-50',
        },
        {
            title: 'Completadas',
            value: stats?.completed_audits || 0,
            icon: CheckCircle2,
            description: 'Auditorías finalizadas',
            color: 'text-green-600',
            bgColor: 'bg-green-50',
        },
        {
            title: 'En Progreso',
            value: stats?.in_progress_audits || 0,
            icon: Clock,
            description: 'Auditorías activas',
            color: 'text-yellow-600',
            bgColor: 'bg-yellow-50',
        },
        {
            title: 'Programadas',
            value: stats?.scheduled_audits || 0,
            icon: Calendar,
            description: 'Próximas auditorías',
            color: 'text-purple-600',
            bgColor: 'bg-purple-50',
        },
    ];

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('es-ES', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            
            <div className="space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Dashboard de Auditorías</h1>
                    <p className="text-muted-foreground mt-2">
                        Resumen general del sistema de auditorías
                    </p>
                </div>

                {/* Stats Grid */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {statCards.map((stat) => (
                        <Card key={stat.title}>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    {stat.title}
                                </CardTitle>
                                <div className={`${stat.bgColor} p-2 rounded-lg`}>
                                    <stat.icon className={`h-4 w-4 ${stat.color}`} />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stat.value}</div>
                                <p className="text-xs text-muted-foreground mt-1">
                                    {stat.description}
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Completion Rate Card */}
                {stats && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <TrendingUp className="h-5 w-5 text-green-600" />
                                Tasa de Completitud
                            </CardTitle>
                            <CardDescription>
                                Porcentaje de auditorías completadas
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-4">
                                <div className="text-4xl font-bold text-green-600">
                                    {stats.completion_rate?.toFixed(1) || 0}%
                                </div>
                                <div className="flex-1">
                                    <div className="w-full bg-gray-200 rounded-full h-3">
                                        <div
                                            className="bg-green-600 h-3 rounded-full transition-all"
                                            style={{ width: `${stats.completion_rate || 0}%` }}
                                        />
                                    </div>
                                    <p className="text-sm text-muted-foreground mt-2">
                                        {stats.completed_audits} de {stats.total_audits} auditorías completadas
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Two Column Layout */}
                <div className="grid gap-6 grid-cols-2">
                    {/* Recent Audits */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <FileText className="h-5 w-5" />
                                Auditorías Recientes
                            </CardTitle>
                            <CardDescription>
                                Últimas auditorías actualizadas
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {recent_audits.length > 0 ? (
                                <div className="space-y-4">
                                    {recent_audits.map((audit) => (
                                        <div
                                            key={audit.id}
                                            className="flex items-start justify-between border-b pb-3 last:border-0 last:pb-0"
                                        >
                                            <div className="space-y-1 flex-1">
                                                <p className="font-medium leading-none">
                                                    {audit.title}
                                                </p>
                                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                    <Users className="h-3 w-3" />
                                                    {audit.assigned_to.name}
                                                </div>
                                                {audit.completed_at && (
                                                    <p className="text-xs text-muted-foreground">
                                                        Completada: {formatDate(audit.completed_at)}
                                                    </p>
                                                )}
                                            </div>
                                            <Badge variant={statusConfig[audit.status].variant}>
                                                {statusConfig[audit.status].label}
                                            </Badge>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8 text-muted-foreground">
                                    <AlertCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                                    <p>No hay auditorías recientes</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Upcoming Audits */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Calendar className="h-5 w-5" />
                                Próximas Auditorías
                            </CardTitle>
                            <CardDescription>
                                Auditorías programadas próximamente
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {upcoming_audits.length > 0 ? (
                                <div className="space-y-4">
                                    {upcoming_audits.map((audit) => (
                                        <div
                                            key={audit.id}
                                            className="flex items-start justify-between border-b pb-3 last:border-0 last:pb-0"
                                        >
                                            <div className="space-y-1 flex-1">
                                                <p className="font-medium leading-none">
                                                    {audit.title}
                                                </p>
                                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                    <Users className="h-3 w-3" />
                                                    {audit.assigned_to.name}
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <Badge variant="outline">
                                                    {formatDate(audit.scheduled_date)}
                                                </Badge>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8 text-muted-foreground">
                                    <Calendar className="h-8 w-8 mx-auto mb-2 opacity-50" />
                                    <p>No hay auditorías programadas</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
