<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Http\Requests\StoreBookingRequest;
use App\Http\Requests\UpdateBookingRequest;
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
    public function store(StoreBookingRequest $request)
    {
        // // Validate dữ liệu đầu vào
        // $request->validate([
        //     'start_date' => 'required|date',
        //     'end_date' => 'required|date|after_or_equal:start_date',
        //     'totalamount' => 'required|integer',
        //     'room_id' => 'required|exists:rooms,id',
        //     'service_id' => 'nullable|exists:services,id',
        //     'voucher_id' => 'nullable|exists:vouchers,id',
        // ]);

        // // Lưu thông tin đặt phòng vào database
        // $booking = Booking::create([
        //     'start_date' => $request->input('start_date'),
        //     'end_date' => $request->input('end_date'),
        //     'totalamount' => $request->input('totalamount'),
        //     'room_id' => $request->input('room_id'),
        //     'service_id' => $request->input('service_id'),
        //     'voucher_id' => $request->input('voucher_id'),
        // ]);

        // // Trả về thông báo thành công
        // return response()->json(['message' => 'Booking successfully created!', 'booking' => $booking]);
    }

    /**
     * Display the specified resource.
     */
    // public function show(string $id)
    // {
    //     $booking = Booking::join('services', 'bookings.service_id', '=', 'services.id')
    //         ->join('rooms', 'bookings.room_id', '=', 'rooms.id')
    //         ->join('vouchers', 'bookings.voucher_id', '=', 'vouchers.id')
    //         ->select('bookings.*', 'services.name as service_name', 'vouchers.name as voucher_name')
    //         ->where('bookings.id', $id)
    //         ->whereNull('bookings.deleted_at')
    //         ->first();
    //     if($booking){
    //         return response()->json($booking);
    //     } else {
    //         return response()->json(['message' => 'Không tồn tại'], 404);
    //     }
    // }
    public function show(string $id)
    {
        $booking = Booking::join('services', 'bookings.service_id', '=', 'services.id')
            ->join('rooms', 'bookings.room_id', '=', 'rooms.id')
            ->Join('vouchers', 'bookings.voucher_id', '=', 'vouchers.id')
            ->select(
                'bookings.*',
                'services.name as service_name',
                'services.price as service_price', // Thêm giá dịch vụ
                'rooms.description as room_description',
                'rooms.price as room_price',       // Thêm giá phòng
                'vouchers.name as voucher_name',
                'vouchers.discount as voucher_discount' // Thêm thông tin giảm giá nếu có
            )
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
    public function update(UpdateBookingRequest $request, Booking $booking)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Booking $booking)
    {
        //
    }
}
