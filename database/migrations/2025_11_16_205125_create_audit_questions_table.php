<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('audit_questions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('section_id')->constrained('audit_sections')->onDelete('cascade');
            $table->text('question');
            $table->enum('type', ['text', 'boolean', 'select']);
            $table->boolean('required')->default(false);
            $table->boolean('has_description')->default(false);
            $table->integer('order')->default(0);
            $table->timestamps();
             $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('audit_questions');
    }
};
