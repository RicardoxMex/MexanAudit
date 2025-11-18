import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ClipboardList, Plus, Calendar, Edit, Trash2, User } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Auditorías', href: '/audits' },
];

interface Audit {
    id: number;
    title: string;
    description: string;
    scheduled_date: string;
    status: 'scheduled' | 'downloaded' | 'in_progress' | 'completed' | 'cancelled';
    assigned_to: {
        name: string;
    };
    sections_count?: number;
}

interface AuditsIndexProps {
    audits: {
        data: Audit[];
        current_page: number;
        last_page: number;
    };
}

const statusConfig = {
    scheduled: { label: 'Programada', variant: 'outline' as const },
    downloaded: { label: 'Descargada', variant: 'secondary' as const },
    in_progress: { label: 'En Progreso', variant: 'default' as const },
    completed: { label: 'Completada', variant: 'secondary' as const, color: 'bg-green-100 text-green-800' },
    cancelled: { label: 'Cancelada', variant: 'destructive' as const },
};

export default function AuditsIndex({ audits }: AuditsIndexProps) {
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('es-ES', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Auditorías" />
            
            <div className="space-y-6 ">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Auditorías</h1>
                        <p className="text-muted-foreground mt-2">
                            Gestiona todas las auditorías del sistema
                        </p>
                    </div>
                    <Link href="/audits/create">
                        <Button>
                            <Plus className="h-4 w-4 mr-2" />
                            Nueva Auditoría
                        </Button>
                    </Link>
                </div>

                <div className="grid gap-4">
                    {audits.data.map((audit) => (
                        <Card key={audit.id}>
                            <CardHeader>
                                <div className="flex items-start justify-between">
                                    <div className="space-y-2 flex-1">
                                        <CardTitle className="flex items-center gap-2">
                                            <ClipboardList className="h-5 w-5" />
                                            <Link href={`/audits/${audit.id}`} className="hover:underline">
                                                {audit.title}
                                            </Link>
                                        </CardTitle>
                                        <CardDescription>{audit.description}</CardDescription>
                                        <div className="flex gap-2 flex-wrap">
                                            <Badge 
                                                variant={statusConfig[audit.status].variant}
                                                className={audit.status === 'completed' ? statusConfig[audit.status].color : ''}
                                            >
                                                {statusConfig[audit.status].label}
                                            </Badge>
                                            {audit.sections_count !== undefined && (
                                                <Badge variant="secondary">
                                                    {audit.sections_count} secciones
                                                </Badge>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <Link href={`/audits/${audit.id}/edit`}>
                                            <Button variant="outline" size="sm">
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                        </Link>
                                        <Link href={`/audits/${audit.id}`} method="delete" as="button">
                                            <Button variant="outline" size="sm">
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                    <div className="flex items-center gap-1">
                                        <User className="h-4 w-4" />
                                        {audit.assigned_to.name}
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Calendar className="h-4 w-4" />
                                        {formatDate(audit.scheduled_date)}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </AppLayout>
    );
}
