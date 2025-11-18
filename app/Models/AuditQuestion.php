<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class AuditQuestion extends Model
{
    protected $fillable = [
        'section_id',
        'question',
        'type',
        'required',
        'has_description',
        'order',
    ];

    protected $casts = [
        'required' => 'boolean',
        'has_description' => 'boolean',
        'order' => 'integer',
    ];

    public function section(): BelongsTo
    {
        return $this->belongsTo(AuditSection::class, 'section_id');
    }

    public function options(): HasMany
    {
        return $this->hasMany(AuditQuestionOption::class);
    }

    public function answers(): HasMany
    {
        return $this->hasMany(AuditAnswer::class);
    }
}
