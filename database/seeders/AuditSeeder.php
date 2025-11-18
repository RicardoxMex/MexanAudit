<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class AuditSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Crear usuario de prueba si no existe
        $user = \App\Models\User::firstOrCreate(
            ['email' => 'admin@example.com'],
            [
                'name' => 'Admin User',
                'password' => bcrypt('password'),
            ]
        );

        // Crear secciones
        $sections = [
            [
                'title' => 'Información General',
                'description' => 'Datos generales de la auditoría',
            ],
            [
                'title' => 'Cumplimiento Normativo',
                'description' => 'Verificación de cumplimiento de normas',
            ],
            [
                'title' => 'Seguridad',
                'description' => 'Aspectos de seguridad y protección',
            ],
        ];

        foreach ($sections as $sectionData) {
            $section = \App\Models\AuditSection::create($sectionData);

            // Crear preguntas para cada sección
            \App\Models\AuditQuestion::create([
                'section_id' => $section->id,
                'question' => '¿Se cumple con los requisitos establecidos?',
                'type' => 'boolean',
                'required' => true,
                'has_description' => false,
                'order' => 1,
            ]);

            \App\Models\AuditQuestion::create([
                'section_id' => $section->id,
                'question' => 'Observaciones adicionales',
                'type' => 'text',
                'required' => false,
                'has_description' => true,
                'order' => 2,
            ]);
        }

        // Crear auditorías de ejemplo
        $audits = [
            [
                'title' => 'Auditoría de Seguridad Q1 2025',
                'description' => 'Revisión trimestral de seguridad y cumplimiento',
                'assigned_to' => $user->id,
                'scheduled_date' => now()->addDays(7),
                'status' => 'scheduled',
            ],
            [
                'title' => 'Auditoría de Calidad',
                'description' => 'Verificación de procesos de calidad',
                'assigned_to' => $user->id,
                'scheduled_date' => now()->addDays(14),
                'status' => 'scheduled',
            ],
            [
                'title' => 'Auditoría Interna Mensual',
                'description' => 'Revisión mensual de procedimientos internos',
                'assigned_to' => $user->id,
                'scheduled_date' => now()->subDays(5),
                'started_at' => now()->subDays(3),
                'status' => 'in_progress',
            ],
        ];

        foreach ($audits as $auditData) {
            \App\Models\Audit::create($auditData);
        }
    }
}
