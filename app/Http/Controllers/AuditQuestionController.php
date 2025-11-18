<?php

namespace App\Http\Controllers;

use App\Models\AuditQuestion;
use App\Models\AuditSection;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AuditQuestionController extends Controller
{
    public function index()
    {
        $questions = AuditQuestion::with(['section', 'options'])->latest()->paginate(10);
        
        return Inertia::render('audit-questions/index', [
            'questions' => $questions,
        ]);
    }

    public function create(Request $request)
    {
        $sections = AuditSection::all();
        
        return Inertia::render('audit-questions/create', [
            'sections' => $sections,
            'section_id' => $request->query('section_id'),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'section_id' => 'required|exists:audit_sections,id',
            'question' => 'required|string',
            'type' => 'required|in:text,boolean,select',
            'required' => 'boolean',
            'has_description' => 'boolean',
            'order' => 'nullable|integer',
            'options' => 'nullable|array',
            'options.*.label' => 'required_with:options|string',
            'options.*.value' => 'required_with:options|string',
            'options.*.order' => 'nullable|integer',
        ]);

        $question = AuditQuestion::create([
            'section_id' => $validated['section_id'],
            'question' => $validated['question'],
            'type' => $validated['type'],
            'required' => $validated['required'] ?? false,
            'has_description' => $validated['has_description'] ?? false,
            'order' => $validated['order'] ?? 0,
        ]);

        // Crear opciones si el tipo es select
        if ($validated['type'] === 'select' && !empty($validated['options'])) {
            foreach ($validated['options'] as $index => $option) {
                $question->options()->create([
                    'label' => $option['label'],
                    'value' => $option['value'],
                    'order' => $option['order'] ?? $index,
                ]);
            }
        }

        return redirect()->route('audit-questions.index')
            ->with('success', 'Pregunta creada exitosamente.');
    }

    public function show(AuditQuestion $auditQuestion)
    {
        $auditQuestion->load(['section', 'options']);
        
        return Inertia::render('audit-questions/show', [
            'question' => $auditQuestion,
        ]);
    }

    public function edit(AuditQuestion $auditQuestion)
    {
        $auditQuestion->load('options');
        $sections = AuditSection::all();
        
        return Inertia::render('audit-questions/edit', [
            'question' => $auditQuestion,
            'sections' => $sections,
        ]);
    }

    public function update(Request $request, AuditQuestion $auditQuestion)
    {
        $validated = $request->validate([
            'section_id' => 'required|exists:audit_sections,id',
            'question' => 'required|string',
            'type' => 'required|in:text,boolean,select',
            'required' => 'boolean',
            'has_description' => 'boolean',
            'order' => 'nullable|integer',
            'options' => 'nullable|array',
            'options.*.id' => 'nullable|exists:audit_question_options,id',
            'options.*.label' => 'required_with:options|string',
            'options.*.value' => 'required_with:options|string',
            'options.*.order' => 'nullable|integer',
        ]);

        $auditQuestion->update([
            'section_id' => $validated['section_id'],
            'question' => $validated['question'],
            'type' => $validated['type'],
            'required' => $validated['required'] ?? false,
            'has_description' => $validated['has_description'] ?? false,
            'order' => $validated['order'] ?? 0,
        ]);

        // Sincronizar opciones si el tipo es select
        if ($validated['type'] === 'select') {
            $existingIds = [];
            
            foreach ($validated['options'] ?? [] as $index => $option) {
                if (!empty($option['id'])) {
                    // Actualizar opción existente
                    $auditQuestion->options()->where('id', $option['id'])->update([
                        'label' => $option['label'],
                        'value' => $option['value'],
                        'order' => $option['order'] ?? $index,
                    ]);
                    $existingIds[] = $option['id'];
                } else {
                    // Crear nueva opción
                    $newOption = $auditQuestion->options()->create([
                        'label' => $option['label'],
                        'value' => $option['value'],
                        'order' => $option['order'] ?? $index,
                    ]);
                    $existingIds[] = $newOption->id;
                }
            }
            
            // Eliminar opciones que ya no están
            $auditQuestion->options()->whereNotIn('id', $existingIds)->delete();
        } else {
            // Si cambió el tipo, eliminar todas las opciones
            $auditQuestion->options()->delete();
        }

        return redirect()->route('audit-questions.index')
            ->with('success', 'Pregunta actualizada exitosamente.');
    }

    public function destroy(AuditQuestion $auditQuestion)
    {
        $auditQuestion->delete();

        return redirect()->route('audit-questions.index')
            ->with('success', 'Pregunta eliminada exitosamente.');
    }
}
