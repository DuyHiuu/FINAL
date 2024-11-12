<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Rating extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = ['room_id', 'user_id', 'rating', 'content'];

    // Quan hệ với model Room
    public function room()
    {
        return $this->belongsTo(Room::class);
    }

    // Quan hệ với model User
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
