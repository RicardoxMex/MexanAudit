<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AuditQuestionOption extends Model
{
    protected $fillable = [
        'audit_question_id',
        'label',
        'value',
        'order',
    ];

    protected $casts = [
        'order' => 'integer',
    ];

    public function question(): BelongsTo
    {
        return $this->belongsTo(AuditQuestion::class, 'audit_question_id');
    }
}
