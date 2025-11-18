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
        Schema::create('audit_question_options', function (Blueprint $table) {
            $table->id();
            $table->foreignId('audit_question_id')->constrained('audit_questions')->onDelete('cascade');
            $table->string('label');
            $table->string('value');
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
        Schema::dropIfExists('audit_question_options');
    }
};
