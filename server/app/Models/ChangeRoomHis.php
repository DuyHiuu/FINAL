<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ChangeRoomHis extends Model
{
    use HasFactory;

    protected $table = 'changed_room_history';
    protected $fillable = [
        'payment_id',
        'oldRoomId',
        'newRoomId',
        'difference'
    ];

    public function payment()
    {
        return $this->belongsTo(Payment::class);
    }
}
