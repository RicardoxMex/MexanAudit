<?php

namespace App\Http\Controllers;

use App\Models\Audit;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AuditController extends Controller
{
    public function index()
    {
        $audits = Audit::with(['sections', 'assignedTo'])
            ->latest()
            ->paginate(10);
        
        return Inertia::render('audits/index', [
            'audits' => $audits,
        ]);
    }

    public function create()
    {
        $users = \App\Models\User::select('id', 'name')->get();
        
        return Inertia::render('audits/create', [
            'users' => $users,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'assigned_to' => 'required|exists:users,id',
            'scheduled_date' => 'required|date',
            'status' => 'nullable|in:scheduled,downloaded,in_progress,completed,cancelled',
        ]);

        $validated['status'] = $validated['status'] ?? 'scheduled';

        $audit = Audit::create($validated);

        return redirect()->route('audits.index')
            ->with('success', 'Auditoría creada exitosamente.');
    }

    public function show(Audit $audit)
    {
        $audit->load([
            'sections' => function ($query) {
                $query->withCount('questions');
            },
            'assignedTo'
        ]);
        
        $availableSections = \App\Models\AuditSection::withCount('questions')->get();
        
        return Inertia::render('audits/show', [
            'audit' => $audit,
            'available_sections' => $availableSections,
        ]);
    }

    public function storeSections(Request $request, Audit $audit)
    {
        $validated = $request->validate([
            'section_ids' => 'required|array',
            'section_ids.*' => 'exists:audit_sections,id',
        ]);

        $audit->sections()->sync($validated['section_ids']);

        return redirect()->route('audits.show', $audit)
            ->with('success', 'Secciones actualizadas exitosamente.');
    }

    public function detachSection(Audit $audit, $sectionId)
    {
        $audit->sections()->detach($sectionId);

        return redirect()->route('audits.show', $audit)
            ->with('success', 'Sección removida exitosamente.');
    }

    public function edit(Audit $audit)
    {
        $users = \App\Models\User::select('id', 'name')->get();
        
        return Inertia::render('audits/edit', [
            'audit' => $audit,
            'users' => $users,
        ]);
    }

    public function update(Request $request, Audit $audit)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'assigned_to' => 'required|exists:users,id',
            'scheduled_date' => 'required|date',
            'status' => 'nullable|in:scheduled,downloaded,in_progress,completed,cancelled',
        ]);

        $audit->update($validated);

        return redirect()->route('audits.index')
            ->with('success', 'Auditoría actualizada exitosamente.');
    }

    public function destroy(Audit $audit)
    {
        $audit->delete();

        return redirect()->route('audits.index')
            ->with('success', 'Auditoría eliminada exitosamente.');
    }
}
