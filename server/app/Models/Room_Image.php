<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Room_Image extends Model
{
    use HasFactory,SoftDeletes;
    protected $table = 'room_images';
    protected $fillable = [
        'image',
        'room_id'

    ];
}
