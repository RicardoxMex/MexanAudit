import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ListChecks, Plus, Edit, Trash2, HelpCircle, ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Secciones', href: '/audit-sections' },
    { title: 'Detalle', href: '#' },
];

interface Question {
    id: number;
    question: string;
    type: 'text' | 'boolean' | 'select';
    required: boolean;
    has_description: boolean;
    order: number;
}

interface Section {
    id: number;
    title: string;
    description: string | null;
    questions: Question[];
}

interface SectionShowProps {
    section: Section;
}

const questionTypeLabels = {
    text: 'Texto',
    boolean: 'Sí/No',
    select: 'Selección',
};

export default function SectionShow({ section }: SectionShowProps) {
    const [deleteDialog, setDeleteDialog] = useState<number | null>(null);

    const handleDeleteQuestion = (questionId: number) => {
        router.delete(`/audit-questions/${questionId}`, {
            onSuccess: () => setDeleteDialog(null),
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Sección: ${section.title}`} />
            
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-start justify-between">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <Link href="/audit-sections">
                                <Button variant="ghost" size="sm">
                                    <ArrowLeft className="h-4 w-4" />
                                </Button>
                            </Link>
                            <h1 className="text-3xl font-bold tracking-tight">{section.title}</h1>
                        </div>
                        {section.description && (
                            <p className="text-muted-foreground ml-12">{section.description}</p>
                        )}
                    </div>
                    <div className="flex gap-2">
                        <Link href={`/audit-sections/${section.id}/edit`}>
                            <Button variant="outline">
                                <Edit className="h-4 w-4 mr-2" />
                                Editar Sección
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Questions Section */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="flex items-center gap-2">
                                    <HelpCircle className="h-5 w-5" />
                                    Preguntas de la Sección
                                </CardTitle>
                                <CardDescription>
                                    Gestiona las preguntas que pertenecen a esta sección
                                </CardDescription>
                            </div>
                            <Link href={`/audit-questions/create?section_id=${section.id}`}>
                                <Button>
                                    <Plus className="h-4 w-4 mr-2" />
                                    Agregar Pregunta
                                </Button>
                            </Link>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {section.questions.length > 0 ? (
                            <div className="space-y-4">
                                {section.questions.map((question) => (
                                    <div
                                        key={question.id}
                                        className="flex items-start justify-between border rounded-lg p-4 hover:bg-accent/50 transition-colors"
                                    >
                                        <div className="space-y-2 flex-1">
                                            <div className="flex items-start gap-2">
                                                <Badge variant="outline" className="mt-1">
                                                    {question.order}
                                                </Badge>
                                                <p className="font-medium">{question.question}</p>
                                            </div>
                                            <div className="flex gap-2 flex-wrap ml-10">
                                                <Badge variant="outline">
                                                    {questionTypeLabels[question.type]}
                                                </Badge>
                                                {question.required && (
                                                    <Badge variant="destructive">Requerida</Badge>
                                                )}
                                                {question.has_description && (
                                                    <Badge variant="secondary">Con descripción</Badge>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <Link href={`/audit-questions/${question.id}/edit`}>
                                                <Button variant="outline" size="sm">
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                            </Link>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => setDeleteDialog(question.id)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12 text-muted-foreground">
                                <HelpCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                <p className="text-lg font-medium mb-2">No hay preguntas</p>
                                <p className="mb-4">Esta sección aún no tiene preguntas asignadas</p>
                                <Link href={`/audit-questions/create?section_id=${section.id}`}>
                                    <Button>
                                        <Plus className="h-4 w-4 mr-2" />
                                        Agregar Primera Pregunta
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteDialog !== null} onOpenChange={() => setDeleteDialog(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>¿Eliminar pregunta?</DialogTitle>
                        <DialogDescription>
                            Esta acción no se puede deshacer. La pregunta será eliminada permanentemente.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeleteDialog(null)}>
                            Cancelar
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={() => deleteDialog && handleDeleteQuestion(deleteDialog)}
                        >
                            Eliminar
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
