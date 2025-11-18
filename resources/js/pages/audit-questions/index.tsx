import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { HelpCircle, Plus, Edit, Trash2 } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Preguntas', href: '/audit-questions' },
];

interface Question {
    id: number;
    question: string;
    type: 'text' | 'boolean' | 'select';
    required: boolean;
    has_description: boolean;
    order: number;
    section?: {
        title: string;
    };
    options_count?: number;
}

interface QuestionsIndexProps {
    questions: {
        data: Question[];
        current_page: number;
        last_page: number;
    };
}

const questionTypeLabels = {
    text: 'Texto',
    boolean: 'Sí/No',
    select: 'Selección',
};

export default function QuestionsIndex({ questions }: QuestionsIndexProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Preguntas de Auditoría" />
            
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Preguntas de Auditoría</h1>
                        <p className="text-muted-foreground mt-2">
                            Gestiona las preguntas de las auditorías
                        </p>
                    </div>
                    <Link href="/audit-questions/create">
                        <Button>
                            <Plus className="h-4 w-4 mr-2" />
                            Nueva Pregunta
                        </Button>
                    </Link>
                </div>

                <div className="grid gap-4">
                    {questions.data.map((question) => (
                        <Card key={question.id}>
                            <CardHeader>
                                <div className="flex items-start justify-between">
                                    <div className="space-y-2 flex-1">
                                        <CardTitle className="flex items-center gap-2">
                                            <HelpCircle className="h-5 w-5" />
                                            {question.question}
                                        </CardTitle>
                                        <div className="flex gap-2 flex-wrap">
                                            <Badge variant="outline">
                                                {questionTypeLabels[question.type]}
                                            </Badge>
                                            {question.required && (
                                                <Badge variant="destructive">Requerida</Badge>
                                            )}
                                            {question.has_description && (
                                                <Badge variant="secondary">Con descripción</Badge>
                                            )}
                                            {question.section && (
                                                <Badge variant="secondary">
                                                    {question.section.title}
                                                </Badge>
                                            )}
                                            <Badge variant="outline">Orden: {question.order}</Badge>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <Link href={`/audit-questions/${question.id}/edit`}>
                                            <Button variant="outline" size="sm">
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                        </Link>
                                        <Link href={`/audit-questions/${question.id}`} method="delete" as="button">
                                            <Button variant="outline" size="sm">
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            </CardHeader>
                            {question.options_count !== undefined && question.options_count > 0 && (
                                <CardContent>
                                    <Badge variant="secondary">
                                        {question.options_count} opciones
                                    </Badge>
                                </CardContent>
                            )}
                        </Card>
                    ))}
                </div>
            </div>
        </AppLayout>
    );
}
