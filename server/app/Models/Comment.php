<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Comment extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'comments';
    protected $fillable = [
        'content',
        'user_id',
        'room_id',
    ];

    // Quan hệ với bảng Rooms
    public function room()
    {
        return $this->belongsTo(Room::class, 'room_id');
    }

    // Quan hệ với bảng User
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
