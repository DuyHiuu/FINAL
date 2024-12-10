<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Payment extends Model
{
    use HasFactory, SoftDeletes;


    const TRANG_THAI = [
        'cho_xac_nhan' => 'Chờ xác nhận',
        'da_xac_nhan' => 'Đã xác nhận',
        'huy_don_hang' => 'Hủy đơn hàng',

    ];

    const TRANG_THAI_THANH_TOAN = [
        'chua_thanh_toan' => 'Chưa thanh toán',
        'da_thanh_toan' => 'Đã thanh toán',
    ];

    const CHO_XAC_NHAN = 'cho_xac_nhan';
    const DA_XAC_NHAN  = 'da_xac_nhan';
    const HUY_DON_HANG = 'huy_don_hang';
    const CHUA_THANH_TOAN = 'chua_thanh_toan';
    const DA_THANH_TOAN = 'da_thanh_toan';

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
        'total_amount',
        'booking_id',
        'user_id',
        'paymethod_id',
        'status_id',
        'is_processed',
        'voucher_id',
        'different_amount',
    ];

    public function booking()
    {
        return $this->belongsTo(Booking::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function paymethod()
    {
        return $this->belongsTo(Paymethod::class);
    }

    public function status()
    {
        return $this->belongsTo(Status::class);
    }

    public function voucher()
    {
        return $this->belongsTo(Voucher::class);
    }
}
