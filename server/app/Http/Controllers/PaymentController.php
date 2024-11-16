<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use App\Http\Requests\StorePaymentRequest;
use App\Http\Requests\UpdatePaymentRequest;
use App\Models\Booking;
use App\Models\Status;
use App\Models\Voucher;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class PaymentController extends Controller
{
    /**
     * Display a listing of the resource.
     */

    public function index(String $id)
    {
        $payments = Payment::with(['status', 'booking.room.size', 'user', 'voucher'])
            ->where('user_id', $id)
            ->whereNull('deleted_at')
            ->orderBy('id', 'desc')
            ->get();

        $user = $payments->isNotEmpty() ? $payments->first()->user_id : null;

        $bookings = [];
        $rooms = [];
        $vouchers = [];

        foreach ($payments as $payment) {
            if ($payment->booking) {
                $bookings[] = $payment->booking;
                $rooms[] = [
                    'room' => $payment->booking->room,
                    'size_name' => $payment->booking->room->size->name ?? null,
                ];
            }
        }

        if ($payment->voucher) {
            $vouchers[] = [
                'voucher_name' => $payment->voucher->name ?? 'No name',
                'voucher_code' => $payment->voucher->code ?? 'No code',
                'voucher_discount' => $payment->voucher->discount ?? 0,
            ];
        } else {
            $vouchers[] = [
                'voucher_name' => 'No voucher',
                'voucher_code' => 'No code',
                'voucher_discount' => 0,
            ];
        }

        return response()->json([
            'status' => true,
            'data' => [
                'payment' => $payments,
                'user' => $user,
                'booking' => $bookings,
                'room' => $rooms,
                'voucher' => $vouchers,
            ]
        ]);
    }

    public function payAd()
    {
        $payments = Payment::with(['status', 'booking.room.size', 'user'])
            ->whereNull('deleted_at')
            ->orderBy('id', 'desc')
            ->get();

        $user = $payments->isNotEmpty() ? $payments->first()->user_id : null;

        $bookings = [];
        $rooms = [];

        foreach ($payments as $payment) {
            if ($payment->booking) {
                $bookings[] = $payment->booking;
                $rooms[] = [
                    'room' => $payment->booking->room,
                    'size_name' => $payment->booking->room->size->name ?? null,
                ];
            }
        }

        return response()->json([
            'status' => true,
            'data' => [
                'payment' => $payments,
                'user' => $user,
                'booking' => $bookings,
                'room' => $rooms,
            ]
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $payments = Payment::with('booking.services')->get();

        $subTotal_service = 0;
        $subTotal_room = 0;

        foreach ($payments as $payment) {
            $booking = $payment->booking; // Lấy booking từ mỗi payment

            if (!empty($booking)) {
                $startDate = Carbon::parse($booking->start_date);
                $endDate = Carbon::parse($booking->end_date);

                // Tính khoảng cách ngày
                $days = max(1, $startDate->diffInDays($endDate));
                if ($booking->room) {
                    $subTotal_room += $booking->room->price * $days;
                }

                // Tính tổng tiền cho các dịch vụ trong booking
                if ($booking->services->isNotEmpty()) {
                    foreach ($booking->services as $service) {
                        // Tính tổng tiền dịch vụ và nhân với số lượng từ pivot table
                        $subTotal_service += $service->price;
                    }
                }
            }
        }
        $payment_method = $payment->paymethod;

        $totalAmount = $subTotal_service + $subTotal_room;

        return response()->json([
            'subTotal_service' => $subTotal_service,
            'subTotal_room' => $subTotal_room,
            'totalAmount' => $totalAmount,
            'payment_method' =>   $payment_method
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make(
            $request->all(),
            [
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
            ],
            [
                'pet_name.required' => 'Tên thú cưng không được để trống',
                'pet_name.string' => 'Tên thú cưng phải là chuỗi',
                'pet_name.max' => 'Tên thú cưng không được vượt quá 255 kis tự',
                'pet_type.required' => 'Tên Loài thú cưng không được để trống',
                'pet_type.max' => 'Tên loài không được vượt quá 255 kí tự',
                'pet_description.required' => 'Mô tả không được để trống',
                'pet_description.string' => 'Mô tả phải là chuỗi kí tự',
                'pet_health.required' => 'Sức khẻo thú cưng không được để trống',
                'user_name.required' => 'Tên nguời đặt không được để trống',
                'user_name.max' => 'Tên không được vượt quá 255 kí tự',
                'user_address.required' => 'Địa chỉ không được để trống',
                'user_address.max' => 'Địa chỉ không được vượt quá 255 kí tự',
                'user_email.required' => 'Email không được để trống',
                'user_email.email' => 'Email không đúng định dạng',
                'user_email.max' => 'Email không được vượt quá 255 kí tự',
                'user_phone.required' => 'Số điện thoại không được để trống',
                'user_phone.string' => 'Số điện thoại phải là chuỗi',
                'user_phone.max' => 'Số điện không vượt quá 255 kí tự',
            ]
        );

        if ($validator->fails()) {
            return response()->json(['status' => 'error', 'message' => $validator->messages()], 400);
        }

        if ($request->isMethod('POST')) {
            DB::beginTransaction();

            try {
                $params = $request->all();
                // Lấy booking dựa trên booking_id từ request
                $booking = Booking::find($params['booking_id']);

                $subTotal_service = 0;
                $subTotal_room = 0;

                if (!empty($booking)) {
                    $startDate = Carbon::parse($booking->start_date);
                    $endDate = Carbon::parse($booking->end_date);

                    // Tính khoảng cách ngày
                    $days = max(1, $startDate->diffInDays($endDate));

                    $subTotal_room += $booking->room->price * $days;


                    if ($booking->services && $booking->services->isNotEmpty()) {
                        foreach ($booking->services as $item) {
                            if ($item->id === 2) {
                                // Tính quantity dựa trên days, đảm bảo quantity không dưới 1
                                $quantity = max(1, floor($days / 3));

                                $subTotal_service += $item->price * $quantity;
                            } else {
                                // Tính tổng tiền cho các dịch vụ còn lại
                                $subTotal_service += $item->price;
                            }
                        }
                    }

                    $total_amount = $subTotal_room + $subTotal_service;

                    $voucherID = $request->input('voucher_id');

                    $discount = 0;
                    $totalAmount = $total_amount;

                    if ($voucherID) {

                        $voucher = Voucher::where('id', $voucherID)
                            ->where('is_active', true)
                            ->first();

                        if (!$voucher) {
                            return response()->json(['message' => 'Voucher không hợp lệ.'], 400);
                        }

                        if ($voucher->end_date < now()) {
                            return response()->json(['message' => 'Voucher đã hết hạn.'], 400);
                        }

                        if ($voucher->quantity === 0) {
                            return response()->json(['message' => 'Voucher đã hết số lần sử dụng.'], 400);
                        }

                        // Kiểm tra tổng tiền đơn hàng có đủ để sử dụng voucher không
                        if ($total_amount < $voucher->min_total_amount) {
                            return response()->json(['error' => 'Số tiền không đủ để áp dụng voucher'], 400);
                        }

                        if ($voucher->type === '%') {
                            $discount = $total_amount * ($voucher->discount / 100);
                        } else {
                            $discount = $voucher->discount;
                        }

                        $totalAmount = max(0, $total_amount - $discount);


                        // Thêm tổng tiền vào params trước khi tạo payment
                        $params['total_amount'] = $totalAmount;
                    } else {
                        $params['total_amount'] = $total_amount;
                    }
                }

                // Mặc định status_id = 1 khi thêm 
                $params['status_id'] = $params['status_id'] ?? 1;

                // Tạo một bản ghi payment mới với tổng tiền
                $payment = Payment::query()->create($params);

                // Lưu ID của payment
                $payment_id = $payment->id;

                $room = $booking->room;

                if ($room->quantity > 0) {
                    $room->increment('is_booked', 1);

                    if ($room->quantity === $room->is_booked) {
                        $room->update(['statusroom' => 'Hết phòng']);
                    }
                } else {
                    return response()->json(['error' => 'Phòng đã hết, vui lòng chọn phòng khác'], 400);
                }

                if ($voucherID) {
                    if ($voucher->quantity > 0) {
                        $voucher->decrement('quantity', 1);

                        if ($voucher->quantity === 0) {
                            $voucher->update(['is_active' => 0]);
                        }
                    }
                }

                DB::commit();
                return response()->json([
                    'status' => 'Đơn hàng đã thanh toán thành công',
                    'payment_id' => $payment_id,
                    'total_amount' => $totalAmount,
                    'discount' => $discount
                ], 201);
            } catch (\Exception $e) {
                DB::rollBack();

                return response()->json(['status' => 'Xảy ra lỗi trong quá trình thanh toán. Vui lòng thử lại!', 'message' => $e->getMessage()], 500);
            }
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $payment = Payment::findOrFail($id);

        $status_pay = Status::get();

        $voucher = Status::get();

        $paymentMethod = $payment->paymethod ? $payment->paymethod->name : null;

        $status = $payment->status ? $payment->status->status_name : null;

        $voucher = $payment->voucher ? $payment->voucher : null;

        $booking = $payment->booking;

        $room = $booking->room;

        $size = $room && $room->size ? $room->size->name : null;

        $services = $booking->services;

        return response()->json([
            'payment' => [
                'payment' => $payment,
                'room' => $room,
                'service' => $services,
                'booking' => $booking,
                'paymentMethod' => $paymentMethod,
                'status' => $status,
                'size' => $size,
                'status_pay' => $status_pay,
                'voucher' => $voucher,
            ]
        ]);
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

        // Validate dữ liệuDB::beginTransaction();

        $validator = Validator::make($request->all(), [
            'status_id' => 'required|integer|exists:status_payments,id', // Giả sử status lưu trong bảng 'statuses'
        ]);

        // Nếu xác thực thất bại, trả về lỗi
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        DB::beginTransaction();

        try {
            if ($request->status_id === 1) {
                $payment->update(['status_id' => 3]);
            } else {
                $payment->update(['status_id' => $request->status_id]);
            }

            DB::commit();

            $status = $payment->status;

            return response()->json([
                'message' => 'Cập nhật trạng thái thành công!',
                'payment' => $payment,
                'status_payment' => $status
            ], 200);
        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'status' => 'error',
                'message' => 'Đã xảy ra lỗi trong quá trình cập nhật trạng thái. Vui lòng thử lại!',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    public function fetchChartData(Request $request)
    {
        try {
            // Xử lý các tham số và lấy dữ liệu
            $type = $request->input('type');
            $year = $request->input('year');
            $month = $request->input('month');
            $start = $request->input('start');
            $end = $request->input('end');

            // Giả sử bạn có phương thức để lấy dữ liệu doanh thu
            $chartData = $this->getRevenueData($type, $year, $month, $start, $end);

            if (!$chartData) {
                return response()->json(['status' => false, 'message' => 'Không có dữ liệu cho yêu cầu này.'], 404);
            }

            return response()->json(['status' => true, 'data' => $chartData]);
        } catch (\Exception $e) {
            return response()->json(['status' => false, 'message' => 'Có lỗi xảy ra trong quá trình xử lý.'], 500);
        }
    }


    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        // // Tìm Payment theo id
        // $payment = Payment::findOrFail($id);

        // // Xóa mềm (soft delete)
        // $payment->delete();

        // return response()->json(['message' => 'Thanh toán đã xóa thành công.']);
    }

    public function applyVoucher(Request $request)
    {

        $params = $request->all();

        $voucherID = $request->input('voucher_id');

        $voucher = Voucher::where('id', $voucherID)
            ->where('is_active', true)
            ->first();

        $booking = Booking::findOrFail($params['booking_id']);

        $subTotal = $booking->totalamount;

        $discount = 0;

        if (!$voucher) {
            return response()->json(['message' => 'Voucher không hợp lệ.'], 400);
        }

        if ($voucher->end_date < now()) {
            return response()->json(['message' => 'Voucher đã hết hạn.'], 400);
        }

        if ($voucher->quantity === 0) {
            return response()->json(['message' => 'Voucher đã hết số lần sử dụng.'], 400);
        }

        // Kiểm tra tổng tiền đơn hàng có đủ để sử dụng voucher không
        if ($subTotal > $voucher->min_total_amount) {
            return response()->json(['error' => 'Số tiền không đủ để áp dụng voucher'], 400);
        }

        if ($voucher->type === '%') {
            $discount = $subTotal * ($voucher->discount / 100);
        } else {
            $discount = $voucher->discount;
        }

        return response()->json([
            'discount' => $discount,
            'subTotal' => $subTotal
        ], 201);
    }
}
