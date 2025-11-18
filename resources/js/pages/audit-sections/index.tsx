import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ListChecks, Plus, Edit, Trash2 } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Secciones', href: '/audit-sections' },
];

interface Section {
    id: number;
    title: string;
    description: string | null;
    questions_count?: number;
}

interface SectionsIndexProps {
    sections: {
        data: Section[];
        current_page: number;
        last_page: number;
    };
}

export default function SectionsIndex({ sections }: SectionsIndexProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Secciones de Auditoría" />
            
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Secciones de Auditoría</h1>
                        <p className="text-muted-foreground mt-2">
                            Gestiona las secciones que componen las auditorías
                        </p>
                    </div>
                    <Link href="/audit-sections/create">
                        <Button>
                            <Plus className="h-4 w-4 mr-2" />
                            Nueva Sección
                        </Button>
                    </Link>
                </div>

                <div className="grid gap-4">
                    {sections.data.map((section) => (
                        <Card key={section.id}>
                            <CardHeader>
                                <div className="flex items-start justify-between">
                                    <div className="space-y-1">
                                        <CardTitle className="flex items-center gap-2">
                                            <ListChecks className="h-5 w-5" />
                                            <Link href={`/audit-sections/${section.id}`} className="hover:underline">
                                                {section.title}
                                            </Link>
                                        </CardTitle>
                                        {section.description && (
                                            <CardDescription>{section.description}</CardDescription>
                                        )}
                                    </div>
                                    <div className="flex gap-2">
                                        <Link href={`/audit-sections/${section.id}/edit`}>
                                            <Button variant="outline" size="sm">
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                        </Link>
                                        <Link href={`/audit-sections/${section.id}`} method="delete" as="button">
                                            <Button variant="outline" size="sm">
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            </CardHeader>
                            {section.questions_count !== undefined && (
                                <CardContent>
                                    <Badge variant="secondary">
                                        {section.questions_count} preguntas
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
