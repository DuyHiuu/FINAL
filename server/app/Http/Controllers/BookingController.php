<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Http\Requests\StoreBookingRequest;
use App\Http\Requests\UpdateBookingRequest;
use Dotenv\Validator;
use Illuminate\Http\Request;

class BookingController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $booking = Booking::join('services', 'bookings.service_id', '=', 'services.id')
            ->join('rooms', 'bookings.room_id', '=', 'rooms.id')
            ->join('vouchers', 'bookings.voucher_id', '=', 'vouchers.id')
            ->select('bookings.*', 'services.name as service_name', 'vouchers.name as voucher_name')
            ->orderBy('bookings.id','desc')
            ->whereNull('bookings.deleted_at')
            ->get();
        $booking->makeHidden(['service_id','room_id', 'voucher_id']);
        return response()->json([
            'status' => true,
            'message' => 'Lấy danh sách thành công',
            'data' => $booking
        ]);    
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // // Validate dữ liệu
        // $validator = Validator::make($request->all(), [
        //     'start_date' => 'required|date',
        //     'end_date' => 'required|date|after_or_equal:start_date',
        //     'totalamount' => 'required|integer',
        //     'quantity_service' => 'required|integer',
        //     'room_id' => 'required|exists:rooms,id',
        //     'service_id' => 'nullable|exists:services,id',
        //     'voucher_id' => 'nullable|exists:vouchers,id',
        // ]);
        // // Nếu có lỗi validate
        // if ($validator->fails()) {
        //     return response()->json(['errors' => $validator->errors()], 422);
        // }

        // Tạo mới booking
        $booking = Booking::create($request->all());
        // Trả về phản hồi JSON
        return response()->json(['message' => 'Đặt phòng thành công!', 'booking' => $booking], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $booking = Booking::join('services', 'bookings.service_id', '=', 'services.id')
            ->join('rooms', 'bookings.room_id', '=', 'rooms.id')
            ->join('vouchers', 'bookings.voucher_id', '=', 'vouchers.id')
            ->select('bookings.*', 'services.name as service_name', 'vouchers.name as voucher_name')
            ->where('bookings.id', $id)
            ->whereNull('bookings.deleted_at')
            ->first();
        if($booking){
            return response()->json($booking);
        } else {
            return response()->json(['message' => 'Không tồn tại'], 404);
        }
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Booking $booking)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        // Tìm booking theo ID
        $booking = Booking::find($id);

        if (!$booking) {
            return response()->json(['message' => 'Không tìm thấy bookings'], 404);
        }

        // // Validate dữ liệu
        // $validator = Validator::make($request->all(), [
        //     'start_date' => 'required|date',
        //     'end_date' => 'required|date|after_or_equal:start_date',
        //     'totalamount' => 'required|integer',
        //     'quantity_service' => 'required|integer',
        //     'room_id' => 'required|exists:rooms,id',
        //     'service_id' => 'nullable|exists:services,id',
        //     'voucher_id' => 'nullable|exists:vouchers,id',
        // ]);
        // // Nếu có lỗi validate
        // if ($validator->fails()) {
        //     return response()->json(['errors' => $validator->errors()], 422);
        // }

        // Cập nhật dữ liệu booking
        $booking->update($request->all());
        // Trả về phản hồi JSON
        return response()->json(['message' => 'Cập nhật đặt phòng thành công!', 'booking' => $booking], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        // Tìm booking theo ID
        $booking = Booking::find($id);
        if (!$booking) {
            return response()->json(['message' => 'Không tìm thấy bookings'], 404);
        }
        // Xóa mềm (soft delete)
        $booking->delete();
        // Trả về phản hồi JSON
        return response()->json(['message' => 'Xóa đặt phòng thành công!'], 200);
    }
}
