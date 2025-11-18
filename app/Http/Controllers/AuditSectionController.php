<?php

namespace App\Http\Controllers;

use App\Models\AuditSection;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AuditSectionController extends Controller
{
    public function index()
    {
        $sections = AuditSection::with('questions')->latest()->paginate(10);
        
        return Inertia::render('audit-sections/index', [
            'sections' => $sections,
        ]);
    }

    public function create()
    {
        return Inertia::render('audit-sections/create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        $section = AuditSection::create($validated);

        return redirect()->route('audit-sections.index')
            ->with('success', 'Sección creada exitosamente.');
    }

    public function show(AuditSection $auditSection)
    {
        $auditSection->load(['questions' => function ($query) {
            $query->orderBy('order');
        }]);
        
        return Inertia::render('audit-sections/show', [
            'section' => $auditSection,
        ]);
    }

    public function edit(AuditSection $auditSection)
    {
        return Inertia::render('audit-sections/edit', [
            'section' => $auditSection,
        ]);
    }

    public function update(Request $request, AuditSection $auditSection)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        $auditSection->update($validated);

        return redirect()->route('audit-sections.index')
            ->with('success', 'Sección actualizada exitosamente.');
    }

    public function destroy(AuditSection $auditSection)
    {
        $auditSection->delete();

        return redirect()->route('audit-sections.index')
            ->with('success', 'Sección eliminada exitosamente.');
    }
}
