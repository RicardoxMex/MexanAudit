import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, Trash2 } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Preguntas', href: '/audit-questions' },
    { title: 'Editar Pregunta', href: '#' },
];

interface Section {
    id: number;
    title: string;
}

interface QuestionOption {
    id?: number;
    label: string;
    value: string;
    order: number;
}

interface Question {
    id: number;
    section_id: number;
    question: string;
    type: string;
    required: boolean;
    has_description: boolean;
    order: number;
    options?: QuestionOption[];
}

interface QuestionsEditProps {
    question: Question;
    sections: Section[];
}

export default function QuestionsEdit({ question, sections }: QuestionsEditProps) {
    const { data, setData, put, processing, errors } = useForm({
        section_id: question.section_id.toString(),
        question: question.question,
        type: question.type,
        required: question.required,
        has_description: question.has_description,
        order: question.order.toString(),
        options: (question.options || []).map(opt => ({
            id: opt.id,
            label: opt.label,
            value: opt.value,
            order: opt.order
        })),
    });

    const addOption = () => {
        setData('options', [...data.options, { id: undefined, label: '', value: '', order: data.options.length }]);
    };

    const removeOption = (index: number) => {
        setData('options', data.options.filter((_, i) => i !== index));
    };

    const updateOption = (index: number, field: 'label' | 'value', value: string) => {
        const newOptions = [...data.options];
        newOptions[index][field] = value;
        setData('options', newOptions);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/audit-questions/${question.id}`);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Editar Pregunta" />
            
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Editar Pregunta</h1>
                    <p className="text-muted-foreground mt-2">
                        Actualiza la información de la pregunta
                    </p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Información de la Pregunta</CardTitle>
                        <CardDescription>
                            Modifica los datos de la pregunta
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="section_id">Sección *</Label>
                                <Select
                                    value={data.section_id}
                                    onValueChange={(value) => setData('section_id', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecciona una sección" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {sections.map((section) => (
                                            <SelectItem key={section.id} value={section.id.toString()}>
                                                {section.title}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.section_id && (
                                    <p className="text-sm text-red-600">{errors.section_id}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="question">Texto de la Pregunta *</Label>
                                <Textarea
                                    id="question"
                                    value={data.question}
                                    onChange={(e) => setData('question', e.target.value)}
                                    placeholder="Escribe la pregunta"
                                    rows={3}
                                />
                                {errors.question && (
                                    <p className="text-sm text-red-600">{errors.question}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="type">Tipo de Pregunta *</Label>
                                <Select
                                    value={data.type}
                                    onValueChange={(value) => {
                                        setData('type', value);
                                        if (value !== 'select') {
                                            setData('options', []);
                                        }
                                    }}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="text">Texto</SelectItem>
                                        <SelectItem value="boolean">Sí/No</SelectItem>
                                        <SelectItem value="select">Selección</SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.type && (
                                    <p className="text-sm text-red-600">{errors.type}</p>
                                )}
                            </div>

                            {data.type === 'select' && (
                                <div className="space-y-4 p-4 border rounded-lg bg-muted/50">
                                    <div className="flex items-center justify-between">
                                        <Label>Opciones de Selección</Label>
                                        <Button type="button" size="sm" onClick={addOption}>
                                            <Plus className="h-4 w-4 mr-1" />
                                            Agregar Opción
                                        </Button>
                                    </div>
                                    
                                    {data.options.length === 0 && (
                                        <p className="text-sm text-muted-foreground">
                                            No hay opciones. Agrega al menos una opción.
                                        </p>
                                    )}

                                    <div className="space-y-3">
                                        {data.options.map((option, index) => (
                                            <div key={index} className="flex gap-2 items-start">
                                                <div className="flex-1 space-y-2">
                                                    <Input
                                                        placeholder="Etiqueta (ej: Excelente)"
                                                        value={option.label}
                                                        onChange={(e) => updateOption(index, 'label', e.target.value)}
                                                    />
                                                    <Input
                                                        placeholder="Valor (ej: excellent)"
                                                        value={option.value}
                                                        onChange={(e) => updateOption(index, 'value', e.target.value)}
                                                    />
                                                </div>
                                                <Button
                                                    type="button"
                                                    variant="destructive"
                                                    size="icon"
                                                    onClick={() => removeOption(index)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                    {errors.options && (
                                        <p className="text-sm text-red-600">{errors.options}</p>
                                    )}
                                </div>
                            )}

                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="required"
                                    checked={data.required}
                                    onCheckedChange={(checked) => setData('required', checked as boolean)}
                                />
                                <Label htmlFor="required" className="cursor-pointer">
                                    Pregunta requerida
                                </Label>
                            </div>

                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="has_description"
                                    checked={data.has_description}
                                    onCheckedChange={(checked) => setData('has_description', checked as boolean)}
                                />
                                <Label htmlFor="has_description" className="cursor-pointer">
                                    Incluir campo de descripción
                                </Label>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="order">Orden</Label>
                                <Input
                                    id="order"
                                    type="number"
                                    value={data.order}
                                    onChange={(e) => setData('order', e.target.value)}
                                    placeholder="Orden de la pregunta"
                                />
                                {errors.order && (
                                    <p className="text-sm text-red-600">{errors.order}</p>
                                )}
                            </div>

                            <div className="flex gap-2 pt-4">
                                <Button type="submit" disabled={processing}>
                                    Actualizar Pregunta
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
