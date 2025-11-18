<?php

use App\Http\Controllers\AuditController;
use App\Http\Controllers\AuditQuestionController;
use App\Http\Controllers\AuditSectionController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified'])->group(function () {
    // Auditorías
    Route::resource('audits', AuditController::class);
    Route::post('audits/{audit}/sections', [AuditController::class, 'storeSections'])->name('audits.sections.store');
    Route::delete('audits/{audit}/sections/{section}', [AuditController::class, 'detachSection'])->name('audits.sections.detach');
    
    // Secciones de auditoría
    Route::resource('audit-sections', AuditSectionController::class);
    
    // Preguntas de auditoría
    Route::resource('audit-questions', AuditQuestionController::class);
});
