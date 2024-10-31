<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Room extends Model
{
    use HasFactory, SoftDeletes;
    protected $table = 'rooms';
    protected $fillable = ['price', 'description', 'statusroom', 'size_id', 'img_thumbnail'];

    public function comments()
    {
        return $this->hasMany(Comment::class);
    }

    public function size()
    {
        return $this->belongsTo(Size::class, 'size_id');
    }

    public function roomImages()
    {
        return $this->hasMany(Room_Image::class);
    }
}
