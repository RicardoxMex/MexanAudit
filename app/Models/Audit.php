<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Audit extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'title',
        'description',
        'assigned_to',
        'scheduled_date',
        'downloaded_at',
        'started_at',
        'completed_at',
        'status',
    ];

    protected $casts = [
        'scheduled_date' => 'datetime',
        'downloaded_at' => 'datetime',
        'started_at' => 'datetime',
        'completed_at' => 'datetime',
    ];

    public function assignedTo(): BelongsTo
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }

    public function sections(): BelongsToMany
    {
        return $this->belongsToMany(
            AuditSection::class,
            'audit_audit_sections',
            'audit_id',
            'section_id'
        );
    }

    public function answers(): HasMany
    {
        return $this->hasMany(AuditAnswer::class);
    }
}
