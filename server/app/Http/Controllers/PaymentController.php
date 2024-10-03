<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use App\Http\Requests\StorePaymentRequest;
use App\Http\Requests\UpdatePaymentRequest;

class PaymentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $payment = Payment::join('users', 'payments.user_id', '=', 'users.id')
            ->join('bookings', 'payments.booking_id', '=', 'bookings.id')
            ->join('paymethods', 'payments.paymethod_id', '=', 'paymethods.id')
            ->select('payments.*', 'users.name as user_name')
            ->orderBy('payments.id', 'desc')
            ->whereNull('payments.deleted_at')
            ->get();
        $payment->makeHidden(['user_id', 'booking_id', 'paymethod_id']);
        return response()->json([
            'status' => true,
            'message' => 'Lấy danh sách thành công',
            'data' => $payment
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
    public function store(StorePaymentRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $payment = Payment::join('users', 'payments.user_id', '=', 'users.id')
            ->join('bookings', 'payments.booking_id', '=', 'bookings.id')
            ->join('paymethods', 'payments.paymethod_id', '=', 'paymethods.id')
            ->select('payments.*', 'users.name as user_name')
            ->where('payments.id', $id)
            ->whereNull('payments.deleted_at')
            ->first();
        if($payment){
            return response()->json($payment);
        }else{
            return response()->json(['message' => 'Không tồn tại'], 404);
        }
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Payment $payment)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdatePaymentRequest $request, Payment $payment)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Payment $payment)
    {
        //
    }
}
