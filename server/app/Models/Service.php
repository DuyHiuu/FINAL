<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Service extends Model
{
    use HasFactory,SoftDeletes;
    protected $table = 'services';
    protected $fillable = [
        'name',
        'image',
        'description',
        'price',
        'quantity'

    ];

    public function bookings()
{
    return $this->belongsToMany(Booking::class, 'booking_services')
                ->withPivot('quantity','price');
}

}
