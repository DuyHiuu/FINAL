<?php

namespace App\Console\Commands;

use App\Models\Booking;
use App\Models\Payment;
use Carbon\Carbon;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class UpdateRoomQuantity extends Command
{
   
    protected $signature = 'room:update-quantity';
    protected $description = 'Command description';

    public function handle()
    {
      DB::transaction(function () {
    // Chọn tất cả các payments cần xử lý
    $payments = Payment::where('is_processed', false)
        ->where('status_id', 2)
        ->whereHas('booking', function ($query) {
            $query->where('end_date', '<', Carbon::now());
        })
        ->with('booking.room.size')
        ->get();

    // Cập nhật `is_processed` cho các payments này
    Payment::whereIn('id', $payments->pluck('id'))->update(['is_processed' => true]);

    // Tăng số lượng phòng cho tất cả các `size` liên quan đến bookings của các payments này
    foreach ($payments as $payment) {
        if ($payment->booking && $payment->booking->room && $payment->booking->room->size) {
            $payment->booking->room->size->increment('quantity', 1);
        }
    }
});

        $this->info('Số lượng phòng đã được cập nhật thành công.');

    }
}
