<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class AuditSection extends Model
{
    protected $fillable = [
        'title',
        'description',
    ];

    public function audits(): BelongsToMany
    {
        return $this->belongsToMany(
            Audit::class,
            'audit_audit_sections',
            'section_id',
            'audit_id'
        );
    }

    public function questions(): HasMany
    {
        return $this->hasMany(AuditQuestion::class, 'section_id');
    }
}
