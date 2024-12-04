<?php

namespace App\Http\Controllers;

use App\Models\Pay_return;
use Illuminate\Http\Request;

class PayReturnController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function listReturnPay()
    {
        $payReturns = Pay_return::with([
            'payment',
            'payment.status',         // Trạng thái của payment
            'payment.user',           // Thông tin user của payment
            'payment.booking.room',   // Thông tin booking và room
            'payment.booking.room.size', // Thông tin size của room
            'payment.voucher'         // Thông tin voucher của payment
        ])->orderBy('id', 'desc')->get();

        // Chuẩn bị dữ liệu trả về
        $data = $payReturns->map(function ($payReturn) {
            return [
                'pay_return_id' => $payReturn->id,
                'bank_name' => $payReturn->bank_name,
                'bank_type_name' => $payReturn->bank_type_name,
                'bank_seri' => $payReturn->bank_seri,
                'amount' => $payReturn->amount,
                'status' => $payReturn->status,
                'created_at' => $payReturn->created_at,
                'updated_at' => $payReturn->updated_at,
                'payment' => $payReturn->payment ? [
                    'payment_id' => $payReturn->payment->id,
                    'user' => $payReturn->payment->user ? [
                        'user_id' => $payReturn->payment->user->id,
                        'name' => $payReturn->payment->user->name,
                        'email' => $payReturn->payment->user->email,
                    ] : null,
                    'status' => $payReturn->payment->status ? [
                        'status_id' => $payReturn->payment->status->id,
                        'name' => $payReturn->payment->status->name,
                    ] : null,
                    'amount' => $payReturn->payment->amount,
                    'booking' => $payReturn->payment->booking ? [
                        'booking_id' => $payReturn->payment->booking->id,
                        'room' => $payReturn->payment->booking->room ? [
                            'room_id' => $payReturn->payment->booking->room->id,
                            'name' => $payReturn->payment->booking->room->name,
                            'size' => $payReturn->payment->booking->room->size ? [
                                'size_id' => $payReturn->payment->booking->room->size->id,
                                'name' => $payReturn->payment->booking->room->size->name,
                            ] : null,
                        ] : null,
                    ] : null,
                    'voucher' => $payReturn->payment->voucher ? [
                        'voucher_id' => $payReturn->payment->voucher->id,
                        'name' => $payReturn->payment->voucher->name,
                        'code' => $payReturn->payment->voucher->code,
                        'discount' => $payReturn->payment->voucher->discount,
                    ] : null,
                    'created_at' => $payReturn->payment->created_at,
                    'updated_at' => $payReturn->payment->updated_at,
                ] : null,
            ];
        });

        return response()->json([
            'status' => true,
            'data' => $data,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function detailReturnPay(string $id)
    {
        $payReturns = Pay_return::with([
            'payment',
            'payment.status',         // Trạng thái của payment
            'payment.user',           // Thông tin user của payment
            'payment.booking.room',   // Thông tin booking và room
            'payment.booking.room.size', // Thông tin size của room
            'payment.voucher'         // Thông tin voucher của payment
        ])->where('id', $id)
        ->orderBy('id', 'desc')->get();

        // Chuẩn bị dữ liệu trả về
        $data = $payReturns->map(function ($payReturn) {
            return [
                'pay_return_id' => $payReturn->id,
                'bank_name' => $payReturn->bank_name,
                'bank_type_name' => $payReturn->bank_type_name,
                'bank_seri' => $payReturn->bank_seri,
                'amount' => $payReturn->amount,
                'status' => $payReturn->status,
                'created_at' => $payReturn->created_at,
                'updated_at' => $payReturn->updated_at,
                'payment' => $payReturn->payment ? [
                    'payment_id' => $payReturn->payment->id,
                    'user' => $payReturn->payment->user ? [
                        'user_id' => $payReturn->payment->user->id,
                        'name' => $payReturn->payment->user->name,
                        'email' => $payReturn->payment->user->email,
                    ] : null,
                    'status' => $payReturn->payment->status ? [
                        'status_id' => $payReturn->payment->status->id,
                        'name' => $payReturn->payment->status->name,
                    ] : null,
                    'amount' => $payReturn->payment->amount,
                    'booking' => $payReturn->payment->booking ? [
                        'booking_id' => $payReturn->payment->booking->id,
                        'room' => $payReturn->payment->booking->room ? [
                            'room_id' => $payReturn->payment->booking->room->id,
                            'name' => $payReturn->payment->booking->room->name,
                            'size' => $payReturn->payment->booking->room->size ? [
                                'size_id' => $payReturn->payment->booking->room->size->id,
                                'name' => $payReturn->payment->booking->room->size->name,
                            ] : null,
                        ] : null,
                    ] : null,
                    'voucher' => $payReturn->payment->voucher ? [
                        'voucher_id' => $payReturn->payment->voucher->id,
                        'name' => $payReturn->payment->voucher->name,
                        'code' => $payReturn->payment->voucher->code,
                        'discount' => $payReturn->payment->voucher->discount,
                    ] : null,
                    'created_at' => $payReturn->payment->created_at,
                    'updated_at' => $payReturn->payment->updated_at,
                ] : null,
            ];
        });

        return response()->json([
            'status' => true,
            'data' => $data,
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
