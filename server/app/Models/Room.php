<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Room extends Model
{
    use HasFactory, SoftDeletes;
    protected $table = 'rooms';

    protected $fillable = ['price', 'description', 'statusroom', 'size_id', 'img_thumbnail', 'quantity'];

    // Quan hệ với bảng Comments
    public function comments()
    {
        return $this->hasMany(Comment::class);
    }

    // Quan hệ với bảng Size
    public function size()
    {
        return $this->belongsTo(Size::class, 'size_id');
    }

    // Quan hệ với bảng RoomImages
    public function roomImages()
    {
        return $this->hasMany(Room_Image::class);
    }

    // Quan hệ với bảng Bookings
    public function bookings()
    {
        return $this->hasMany(Booking::class);
    }

    // Quan hệ với bảng Ratings
    public function ratings()
    {
        return $this->hasMany(Rating::class);
    }
    // Đánh giá tổng
    public function averageRating()
    {
        // Kiểm tra xem phòng có đánh giá không để tránh lỗi chia cho 0
        $average = $this->ratings()->avg('rating');
        return $average ? round($average, 1) : null; // làm tròn 1 chữ số thập phân
    }
}
