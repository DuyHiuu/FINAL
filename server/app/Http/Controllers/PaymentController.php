<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use App\Http\Requests\StorePaymentRequest;
use App\Http\Requests\UpdatePaymentRequest;
use Illuminate\Http\Request;

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
    public function store(Request $request)
    {
        // Validate dữ liệu
        $validatedData = $request->validate([
            'pet_name' => 'required|string|max:255',
            'pet_type' => 'required|string|max:255',
            'pet_description' => 'required|string',
            'pet_health' => 'required|string',
            'user_name' => 'required|string|max:255',
            'user_address' => 'required|string|max:255',
            'user_email' => 'required|email|max:255',
            'user_phone' => 'required|string|max:15',
            'booking_id' => 'required|exists:bookings,id',
            'user_id' => 'required|exists:users,id',
            'paymethod_id' => 'required|exists:paymethods,id',
        ]);

        // Tạo mới Payment
        $payment = Payment::create($validatedData);

        return response()->json(['message' => 'Thanh toán đã được tạo thành công.', 'payment' => $payment]);
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
        if ($payment) {
            return response()->json($payment);
        } else {
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
    public function update(Request $request, string $id)
    {
        // Tìm Payment theo id
        $payment = Payment::findOrFail($id);

        // Validate dữ liệu
        $validatedData = $request->validate([
            'pet_name' => 'string|max:255',
            'pet_type' => 'string|max:255',
            'pet_description' => 'string',
            'pet_health' => 'string',
            'user_name' => 'string|max:255',
            'user_address' => 'string|max:255',
            'user_email' => 'email|max:255',
            'user_phone' => 'string|max:15',
            'booking_id' => 'exists:bookings,id',
            'user_id' => 'exists:users,id',
            'paymethod_id' => 'exists:paymethods,id',
        ]);

        // Cập nhật Payment với dữ liệu mới
        $payment->update($validatedData);

        return response()->json(['message' => 'Thanh toán đã được cập nhật thành công.', 'payment' => $payment]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        // Tìm Payment theo id
        $payment = Payment::findOrFail($id);

        // Xóa mềm (soft delete)
        $payment->delete();

        return response()->json(['message' => 'Thanh toán đã xóa thành công.']);
    }
}
