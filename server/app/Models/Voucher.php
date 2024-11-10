<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Voucher extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'vouchers';

    protected $fillable = [
        'name',
        'code',
        'type',
        'discount',
        'quantity',
        'start_date',
        'end_date',
        'min_total_amount',
        'is_active'
    ];
}
