<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Payment extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'payments';
    protected $fillable = [
        'pet_name',
        'pet_type',
        'pet_description',
        'pet_health',
        'user_name',
        'user_address',
        'user_email',
        'user_phone',
        'booking_id',
        'user_id',
        'paymethod_id'
    ];

    // Quan hệ với bảng bookings
    public function booking()
    {
        return $this->belongsTo(Booking::class);
    }

    // Quan hệ với bảng users
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Quan hệ với bảng paymethods
    public function paymethod()
    {
        return $this->belongsTo(Paymethod::class);
    }
}
