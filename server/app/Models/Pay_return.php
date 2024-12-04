<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Pay_return extends Model
{
    use HasFactory;

    public $timestamps = false;

    protected $table = 'pay_return'; 
    protected $fillable = [
        'bank_name',
        'bank_seri',
        'bank_type_name',
        'payment_id',
        'amount',
        'status',
    ];

    public function payment()
    {
        return $this->belongsTo(Payment::class, 'payment_id', 'id');
    }
}