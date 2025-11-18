import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ClipboardList, Plus, Edit, Trash2, ListChecks, ArrowLeft, Settings, User, Calendar } from 'lucide-react';
import { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Auditorías', href: '/audits' },
    { title: 'Detalle', href: '#' },
];

interface Section {
    id: number;
    title: string;
    description: string | null;
    questions_count?: number;
}

interface Audit {
    id: number;
    title: string;
    description: string;
    scheduled_date: string;
    status: 'scheduled' | 'downloaded' | 'in_progress' | 'completed' | 'cancelled';
    assigned_to: {
        id: number;
        name: string;
    };
    sections: Section[];
}

interface AuditShowProps {
    audit: Audit;
    available_sections: Section[];
}

const statusConfig = {
    scheduled: { label: 'Programada', variant: 'outline' as const },
    downloaded: { label: 'Descargada', variant: 'secondary' as const },
    in_progress: { label: 'En Progreso', variant: 'default' as const },
    completed: { label: 'Completada', variant: 'secondary' as const, color: 'bg-green-100 text-green-800' },
    cancelled: { label: 'Cancelada', variant: 'destructive' as const },
};

export default function AuditShow({ audit, available_sections }: AuditShowProps) {
    const [configDialog, setConfigDialog] = useState(false);
    const [deleteDialog, setDeleteDialog] = useState<number | null>(null);

    const { data, setData, post, processing } = useForm({
        section_ids: audit.sections.map(s => s.id),
    });

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('es-ES', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const handleToggleSection = (sectionId: number) => {
        const newSectionIds = data.section_ids.includes(sectionId)
            ? data.section_ids.filter(id => id !== sectionId)
            : [...data.section_ids, sectionId];
        setData('section_ids', newSectionIds);
    };

    const handleSaveSections = () => {
        post(`/audits/${audit.id}/sections`, {
            onSuccess: () => setConfigDialog(false),
        });
    };

    const handleDetachSection = (sectionId: number) => {
        router.delete(`/audits/${audit.id}/sections/${sectionId}`, {
            onSuccess: () => setDeleteDialog(null),
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Auditoría: ${audit.title}`} />
            
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-start justify-between">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <Link href="/audits">
                                <Button variant="ghost" size="sm">
                                    <ArrowLeft className="h-4 w-4" />
                                </Button>
                            </Link>
                            <h1 className="text-3xl font-bold tracking-tight">{audit.title}</h1>
                        </div>
                        <p className="text-muted-foreground ml-12">{audit.description}</p>
                        <div className="flex gap-2 ml-12">
                            <Badge 
                                variant={statusConfig[audit.status].variant}
                                className={audit.status === 'completed' ? statusConfig[audit.status].color : ''}
                            >
                                {statusConfig[audit.status].label}
                            </Badge>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Link href={`/audits/${audit.id}/edit`}>
                            <Button variant="outline">
                                <Edit className="h-4 w-4 mr-2" />
                                Editar
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Info Cards */}
                <div className="grid gap-4 md:grid-cols-2">
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-medium flex items-center gap-2">
                                <User className="h-4 w-4" />
                                Asignado a
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-2xl font-bold">{audit.assigned_to.name}</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-medium flex items-center gap-2">
                                <Calendar className="h-4 w-4" />
                                Fecha Programada
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-2xl font-bold">{formatDate(audit.scheduled_date)}</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Sections */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="flex items-center gap-2">
                                    <ListChecks className="h-5 w-5" />
                                    Secciones de la Auditoría
                                </CardTitle>
                                <CardDescription>
                                    Secciones configuradas para esta auditoría
                                </CardDescription>
                            </div>
                            <Button onClick={() => setConfigDialog(true)}>
                                <Settings className="h-4 w-4 mr-2" />
                                Configurar Secciones
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {audit.sections.length > 0 ? (
                            <div className="space-y-3">
                                {audit.sections.map((section) => (
                                    <div
                                        key={section.id}
                                        className="flex items-start justify-between border rounded-lg p-4 hover:bg-accent/50 transition-colors"
                                    >
                                        <div className="space-y-1 flex-1">
                                            <div className="flex items-center gap-2">
                                                <ListChecks className="h-4 w-4" />
                                                <p className="font-medium">{section.title}</p>
                                            </div>
                                            {section.description && (
                                                <p className="text-sm text-muted-foreground ml-6">
                                                    {section.description}
                                                </p>
                                            )}
                                            {section.questions_count !== undefined && (
                                                <div className="ml-6">
                                                    <Badge variant="secondary">
                                                        {section.questions_count} preguntas
                                                    </Badge>
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex gap-2">
                                            <Link href={`/audit-sections/${section.id}`}>
                                                <Button variant="outline" size="sm">
                                                    Ver Detalles
                                                </Button>
                                            </Link>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => setDeleteDialog(section.id)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12 text-muted-foreground">
                                <ListChecks className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                <p className="text-lg font-medium mb-2">No hay secciones configuradas</p>
                                <p className="mb-4">Esta auditoría aún no tiene secciones asignadas</p>
                                <Button onClick={() => setConfigDialog(true)}>
                                    <Settings className="h-4 w-4 mr-2" />
                                    Configurar Secciones
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Configure Sections Dialog */}
            <Dialog open={configDialog} onOpenChange={setConfigDialog}>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Configurar Secciones</DialogTitle>
                        <DialogDescription>
                            Selecciona las secciones que formarán parte de esta auditoría
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        {available_sections.map((section) => (
                            <div
                                key={section.id}
                                className="flex items-start space-x-3 border rounded-lg p-4 hover:bg-accent/50 transition-colors"
                            >
                                <Checkbox
                                    id={`section-${section.id}`}
                                    checked={data.section_ids.includes(section.id)}
                                    onCheckedChange={() => handleToggleSection(section.id)}
                                />
                                <div className="flex-1">
                                    <Label
                                        htmlFor={`section-${section.id}`}
                                        className="font-medium cursor-pointer"
                                    >
                                        {section.title}
                                    </Label>
                                    {section.description && (
                                        <p className="text-sm text-muted-foreground mt-1">
                                            {section.description}
                                        </p>
                                    )}
                                    {section.questions_count !== undefined && (
                                        <Badge variant="secondary" className="mt-2">
                                            {section.questions_count} preguntas
                                        </Badge>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setConfigDialog(false)}>
                            Cancelar
                        </Button>
                        <Button onClick={handleSaveSections} disabled={processing}>
                            Guardar Configuración
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteDialog !== null} onOpenChange={() => setDeleteDialog(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>¿Quitar sección?</DialogTitle>
                        <DialogDescription>
                            Esta sección será removida de la auditoría. La sección no será eliminada, solo desvinculada.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeleteDialog(null)}>
                            Cancelar
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={() => deleteDialog && handleDetachSection(deleteDialog)}
                        >
                            Quitar Sección
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
