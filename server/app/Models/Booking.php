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
        'room_id',
        'service_id',
        'voucher_id',
    ];
}
