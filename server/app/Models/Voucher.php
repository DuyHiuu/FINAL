<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Voucher extends Model
{
    use HasFactory;
    
    use SoftDeletes;

    protected $dates = ['deleted_at']; 

    protected $table = 'vouchers';

    protected $fillable = [
        'name',
        'code',
        'discount',
        'quantity',
        'start_date',
        'end_date',
    ];
}
