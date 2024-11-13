<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Booking extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'bookings';
    protected $fillable = [
        'start_date',
        'end_date',
        'quantity_service',
        'room_id',
        'service_id',
    ];

    // Quan hệ với bảng Rooms
    public function room()
    {
        return $this->belongsTo(Room::class);
    }

    // Quan hệ với bảng User
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Quan hệ với bảng Services
    public function services()
    {
        return $this->belongsToMany(Service::class, 'booking_services');
    }
}
