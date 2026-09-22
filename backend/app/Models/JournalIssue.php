<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class JournalIssue extends Model
{
    protected $fillable = ['numero', 'theme', 'published_at', 'pdf_url'];

    protected function casts(): array
    {
        return ['published_at' => 'date'];
    }
}
