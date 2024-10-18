<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use App\Http\Requests\StorePaymentRequest;
use App\Http\Requests\UpdatePaymentRequest;
use App\Models\Booking;
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
    public function index()
    {
        $payments = Payment::get();

        $trangThai = Payment::TRANG_THAI;

        $type_cho_xac_nhan = Payment::CHO_XAC_NHAN;

        return response()->json([
            'payment' => $payments,
            'status' => $trangThai,
            'type_cho_xac_nhan' => $type_cho_xac_nhan,
        ]);

        // $payment = Payment::join('users', 'payments.user_id', '=', 'users.id')
        //     ->join('bookings', 'payments.booking_id', '=', 'bookings.id')
        //     ->join('paymethods', 'payments.paymethod_id', '=', 'paymethods.id')
        //     ->select('payments.*', 'users.name as user_name')
        //     ->orderBy('payments.id', 'desc')
        //     ->whereNull('payments.deleted_at')
        //     ->get();
        // $payment->makeHidden(['user_id', 'booking_id', 'paymethod_id']);
        // return response()->json([
        //     'status' => true,
        //     'message' => 'Lấy danh sách thành công',
        //     'data' => $payment
        // ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $payments = Payment::with('booking.services')->get();

        $subTotal_service = 0;
        $subTotal_room = 0;
        $subTotal_voucher = 0;

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
                        $subTotal_service += $service->price * $service->pivot->quantity;
                    }
                }
                // Kiểm tra xem có voucher hay không và áp dụng giảm giá
                if ($booking->voucher) {
                    $subTotal_voucher += $booking->voucher->discount;
                }
        }
    }
        $payment_method = $payment->paymethod;

        $totalAmount = ($subTotal_service + $subTotal_room) - $subTotal_voucher;

        return response()->json([
            'subTotal_service' => $subTotal_service,
            'subTotal_room' => $subTotal_room,
            'subTotal_voucher' => $subTotal_voucher,
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
            $request->all(),[
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
        ],[
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
            return response()->json(['status'=>'error','message'=>$validator->messages()], 400);
        }

        if($request->isMethod('POST')){
            DB::beginTransaction();

            try{
                $params = $request->all();
                 // Lấy booking dựa trên booking_id từ request
                $booking = Booking::find($params['booking_id']);

                $subTotal_service = 0;
                $subTotal_room = 0;
                $subTotal_voucher = 0;

                if (!empty($booking)) {
                    $startDate = Carbon::parse($booking->start_date);
                    $endDate = Carbon::parse($booking->end_date);

                    // Tính khoảng cách ngày
                    $days = max(1, $startDate->diffInDays($endDate));

                    $subTotal_room += $booking->room->price * $days;


                    // Tính tổng tiền cho các dịch vụ trong booking
                    if ($booking->services->isNotEmpty()) {
                        foreach ($booking->services as $service) {
                            // Tính tổng tiền dịch vụ và nhân với số lượng từ pivot table
                            $subTotal_service += $service->price * $service->pivot->quantity;
                        }
                    }
                    // Kiểm tra xem có voucher hay không và áp dụng giảm giá
                    if ($booking->voucher) {
                        $subTotal_voucher += $booking->voucher->discount;
                    }
            }

                $total_amount = ($subTotal_room + $subTotal_service) - $subTotal_voucher;

                // Thêm tổng tiền vào params trước khi tạo payment
                $params['total_amount'] = $total_amount;

                // Mặc định status_id = 2 khi thêm 
                $params['status_id'] = $params['status_id'] ?? 1;

                // Tạo một bản ghi payment mới với tổng tiền
                $payment = Payment::query()->create($params);

                // Lưu ID của payment
                $payment_id = $payment->id;

                DB::commit();
                return response()->json([
                    'status' => 'Đơn hàng đã thanh toán thành công',
                    'payment_id' => $payment_id,
                    'total_amount' => $total_amount
                ], 201);

            } catch (\Exception $e){
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

       $status = $payment->status;

       return response()->json([
        'payment' => $payment,
        'status_payment' => $status,
       
    ], 200);

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
}
