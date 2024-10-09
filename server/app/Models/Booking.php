<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Booking extends Model
{
    use HasFactory;

    protected $table = 'bookings';
    protected $fillable = [
        'start_date',
        'end_date',
        'totalamount',
        'quantity_service',
        'room_id',
        'service_id',
        'voucher_id',
    ];

    // Quan hệ với bảng Rooms
    public function room()
    {
        return $this->belongsTo(Room::class);
    }

    // Quan hệ với bảng Services
    public function service()
    {
        return $this->belongsTo(Service::class);
    }

    // Quan hệ với bảng Vouchers
    // public function voucher()
    // {
    //     return $this->belongsTo(Voucher::class);
    // }
}
