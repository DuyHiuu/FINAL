<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Http\Requests\StoreBookingRequest;
use App\Http\Requests\UpdateBookingRequest;

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
        //
        
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
