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
            // Lấy tất cả các payments chưa được xử lý, đã thanh toán, và end_date đã qua
            $payments = Payment::where('is_processed', false)
                ->where('status_id', 2)
                ->whereHas('booking', function ($query) {
                    $query->where('end_date', '<', Carbon::now());
                })
                ->with('booking.room')
                ->get();

            // Cập nhật `is_processed` thành true cho các payments này
            Payment::whereIn('id', $payments->pluck('id'))->update(['is_processed' => true]);

            // Trừ số lượng phòng đã đặt
            foreach ($payments as $payment) {
                if ($payment->booking && $payment->booking->room) {
                    $room = $payment->booking->room;
                   
                   if ($room && isset($room->is_booked)) {
                    // Tăng số lượng phòng
                    $room->decrement('is_booked', 1);

                    // Kiểm tra và cập nhật trạng thái phòng nếu số lượng lớn hơn 0
                    if ($room->quantity > $room->is_booked) {
                        $room->statusroom = 'Còn phòng';
                        $room->save();
                        $this->info("Cập nhật trạng thái phòng ID {$room->id} thành 'Còn phòng'.");
                    }
                } else {
                    $this->warn("Không tìm thấy quantity hoặc room ID {$room->id} không tồn tại.");
                }
            } else {
                $this->warn("Payment ID {$payment->id} không có booking hoặc room liên quan.");
            }
                }
            
        });

        $this->info('Số lượng phòng đã được cập nhật thành công.');
    }
}
