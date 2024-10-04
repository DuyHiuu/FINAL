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
}
