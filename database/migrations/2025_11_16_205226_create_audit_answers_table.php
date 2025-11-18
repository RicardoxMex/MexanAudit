<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('audit_answers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('audit_id')->constrained('audits')->onDelete('cascade');
            $table->foreignId('question_id')->constrained('audit_questions')->onDelete('cascade');
            $table->text('answer')->nullable();
            $table->text('comments')->nullable();
            $table->timestamps();
            $table->softDeletes();

            // Índices para mejorar el rendimiento
            $table->index(['audit_id', 'question_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('audit_answers');
    }
};
