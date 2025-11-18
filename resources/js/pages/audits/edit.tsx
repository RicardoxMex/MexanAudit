import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Auditorías', href: '/audits' },
    { title: 'Editar Auditoría', href: '#' },
];

interface User {
    id: number;
    name: string;
}

interface Audit {
    id: number;
    title: string;
    description: string;
    assigned_to: number;
    scheduled_date: string;
    status: string;
}

interface AuditsEditProps {
    audit: Audit;
    users: User[];
}

export default function AuditsEdit({ audit, users }: AuditsEditProps) {
    const { data, setData, put, processing, errors } = useForm({
        title: audit.title,
        description: audit.description,
        assigned_to: audit.assigned_to.toString(),
        scheduled_date: audit.scheduled_date.slice(0, 16),
        status: audit.status,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/audits/${audit.id}`);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Editar Auditoría" />
            
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Editar Auditoría</h1>
                    <p className="text-muted-foreground mt-2">
                        Actualiza la información de la auditoría
                    </p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Información de la Auditoría</CardTitle>
                        <CardDescription>
                            Modifica los datos de la auditoría
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="title">Título *</Label>
                                <Input
                                    id="title"
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                    placeholder="Título de la auditoría"
                                />
                                {errors.title && (
                                    <p className="text-sm text-red-600">{errors.title}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Descripción *</Label>
                                <Textarea
                                    id="description"
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    placeholder="Descripción de la auditoría"
                                    rows={4}
                                />
                                {errors.description && (
                                    <p className="text-sm text-red-600">{errors.description}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="assigned_to">Asignado a *</Label>
                                <Select
                                    value={data.assigned_to}
                                    onValueChange={(value) => setData('assigned_to', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecciona un usuario" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {users.map((user) => (
                                            <SelectItem key={user.id} value={user.id.toString()}>
                                                {user.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.assigned_to && (
                                    <p className="text-sm text-red-600">{errors.assigned_to}</p>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="scheduled_date">Fecha Programada *</Label>
                                    <Input
                                        id="scheduled_date"
                                        type="datetime-local"
                                        value={data.scheduled_date}
                                        onChange={(e) => setData('scheduled_date', e.target.value)}
                                    />
                                    {errors.scheduled_date && (
                                        <p className="text-sm text-red-600">{errors.scheduled_date}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="status">Estado</Label>
                                    <Select
                                        value={data.status}
                                        onValueChange={(value) => setData('status', value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="scheduled">Programada</SelectItem>
                                            <SelectItem value="downloaded">Descargada</SelectItem>
                                            <SelectItem value="in_progress">En Progreso</SelectItem>
                                            <SelectItem value="completed">Completada</SelectItem>
                                            <SelectItem value="cancelled">Cancelada</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors.status && (
                                        <p className="text-sm text-red-600">{errors.status}</p>
                                    )}
                                </div>
                            </div>

                            <div className="flex gap-2 pt-4">
                                <Button type="submit" disabled={processing}>
                                    Actualizar Auditoría
                                </Button>
                                <Button type="button" variant="outline" onClick={() => (window as any).history.back()}>
                                    Cancelar
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
