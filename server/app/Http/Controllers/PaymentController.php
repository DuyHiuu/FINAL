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
use Illuminate\Support\Facades\Mail;
use App\Mail\OrderConfirmation;

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
            $booking = $payment->booking;

            if (!empty($booking)) {
                $startDate = Carbon::parse($booking->start_date);
                $endDate = Carbon::parse($booking->end_date);

                $days = max(1, $startDate->diffInDays($endDate));
                if ($booking->room) {
                    $subTotal_room += $booking->room->price * $days;
                }

                if ($booking->services->isNotEmpty()) {
                    foreach ($booking->services as $service) {
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

                $booking = Booking::find($params['booking_id']);

                $subTotal_service = 0;
                $subTotal_room = 0;

                if (!empty($booking)) {
                    $startDate = Carbon::parse($booking->start_date);
                    $endDate = Carbon::parse($booking->end_date);

                    $days = max(1, $startDate->diffInDays($endDate));

                    $subTotal_room += $booking->room->price * $days;


                    if ($booking->services && $booking->services->isNotEmpty()) {
                        foreach ($booking->services as $item) {
                            if ($item->id === 2) {
                                $quantity = max(1, floor($days / 3));
                                $subTotal_service += $item->price * $quantity;
                            } else {
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

                        if ($total_amount < $voucher->min_total_amount) {
                            return response()->json(['error' => 'Số tiền không đủ để áp dụng voucher'], 400);
                        }

                        if ($voucher->type === '%') {
                            $discount = $total_amount * ($voucher->discount / 100);
                        } else {
                            $discount = $voucher->discount;
                        }

                        $totalAmount = max(0, $total_amount - $discount);

                        $params['total_amount'] = $totalAmount;
                    } else {
                        $params['total_amount'] = $total_amount;
                    }
                }

                // Mặc định status_id = 1 khi thêm

                $params['status_id'] = $params['status_id'] ?? 1;

                $payment = Payment::query()->create($params);

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
                $payment = Payment::create($params);
                $payment_id = $payment->id;
                $paymethod=$payment->paymethod_id;
                //thanh toasn on
                if($paymethod==2){
                    error_reporting(E_ALL & ~E_NOTICE & ~E_DEPRECATED);
                    date_default_timezone_set('Asia/Ho_Chi_Minh');
                    $startTime = date("YmdHis");
                    $expire = date('YmdHis', strtotime('+15 minutes', strtotime($startTime)));
                    $vnp_Url = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
                    $vnp_Returnurl = "http://localhost:5173/history1";
                    $vnp_TmnCode = "5WVCZE5R";//Mã website tại VNPAY
                    $vnp_HashSecret = "ADCE5WBMNAQPXX182RHVP9JQ7258XK9V"; //Chuỗi bí mật

                    $vnp_TxnRef = $payment_id; //Mã đơn hàng. Trong thực tế Merchant cần insert đơn hàng vào DB và gửi mã này sang VNPAY
                    $vnp_OrderInfo = 'Thanh tóán hoá đơn';
                    $vnp_OrderType = 'PetSpa';
                    $vnp_Amount = $payment->total_amount * 100;
                    $vnp_Locale = 'VN';
                    $vnp_BankCode = '';
                    $vnp_IpAddr = $_SERVER['REMOTE_ADDR'];
                    $inputData = array(
                        "vnp_Version" => "2.1.0",
                        "vnp_TmnCode" => $vnp_TmnCode,
                        "vnp_Amount" => $vnp_Amount,
                        "vnp_Command" => "pay",
                        "vnp_CreateDate" => date('YmdHis'),
                        "vnp_CurrCode" => "VND",
                        "vnp_IpAddr" => $vnp_IpAddr,
                        "vnp_Locale" => $vnp_Locale,
                        "vnp_OrderInfo" => $vnp_OrderInfo,
                        "vnp_OrderType" => $vnp_OrderType,
                        "vnp_ReturnUrl" => $vnp_Returnurl,
                        "vnp_TxnRef" => $vnp_TxnRef,
                    );

                    if (isset($vnp_BankCode) && $vnp_BankCode != "") {
                        $inputData['vnp_BankCode'] = $vnp_BankCode;
                    }
                    if (isset($vnp_Bill_State) && $vnp_Bill_State != "") {
                        $inputData['vnp_Bill_State'] = $vnp_Bill_State;
                    }

                    //var_dump($inputData);
                    ksort($inputData);
                    $query = "";
                    $i = 0;
                    $hashdata = "";
                    foreach ($inputData as $key => $value) {
                        if ($i == 1) {
                            $hashdata .= '&' . urlencode($key) . "=" . urlencode($value);
                        } else {
                            $hashdata .= urlencode($key) . "=" . urlencode($value);
                            $i = 1;
                        }
                        $query .= urlencode($key) . "=" . urlencode($value) . '&';
                    }

                    $vnp_Url = $vnp_Url . "?" . $query;
                    if (isset($vnp_HashSecret)) {
                        $vnpSecureHash =   hash_hmac('sha512', $hashdata, $vnp_HashSecret);//
                        $vnp_Url .= 'vnp_SecureHash=' . $vnpSecureHash;
                    }
                    $returnData = array('code' => '00'
                    , 'message' => 'success'
                    , 'data' => $vnp_Url);
//        if (isset($_POST['redirect'])) {
//            header('Location: ' . $vnp_Url);
//            die();
//        } else {
//            echo json_encode($returnData);
//        }
                    // vui lòng tham khảo thêm tại code demo
                    return response()->json($vnp_Url);
                }


                // Send order confirmation email to the user
//              Mail::to($payment->user->email)->send(new OrderConfirmation());

                // // Send order confirmation email to the user
                // Mail::to($payment->user->email)->send(new OrderConfirmation());



                // Commit the transaction
                DB::commit();
                return response()->json([
                    'status' => 'Đơn hàng đã thanh toán thành công',
                    'payment_id' => $payment_id,
                    'total_amount' => $totalAmount,
                    'discount' => $discount,
                    'paymethod'=>$paymethod

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

    public function check_payment(Request $request)
    {

        $inputData = array();
        $returnData = array();
        $vnp_HashSecret = "ADCE5WBMNAQPXX182RHVP9JQ7258XK9V";
        foreach ($request->all() as $key => $value) {
            if (substr($key, 0, 4) == "vnp_") {
                $inputData[$key] = $value;
            }
        }

        $vnp_SecureHash = $inputData['vnp_SecureHash'];
        unset($inputData['vnp_SecureHash']);
        ksort($inputData);
        $i = 0;
        $hashData = "";
        foreach ($inputData as $key => $value) {
            if ($i == 1) {
                $hashData = $hashData . '&' . urlencode($key) . "=" . urlencode($value);
            } else {
                $hashData = $hashData . urlencode($key) . "=" . urlencode($value);
                $i = 1;
            }
        }

        $secureHash = hash_hmac('sha512', $hashData, $vnp_HashSecret);
        $vnpTranId = $inputData['vnp_TransactionNo']; //Mã giao dịch tại VNPAY
        $vnp_BankCode = $inputData['vnp_BankCode']; //Ngân hàng thanh toán
        $vnp_Amount = $inputData['vnp_Amount']/100; // Số tiền thanh toán VNPAY phản hồi

        $Status = 0; // Là trạng thái thanh toán của giao dịch chưa có IPN lưu tại hệ thống của merchant chiều khởi tạo URL thanh toán.
    $payments = $inputData['vnp_TxnRef'];

    try {
        //Check Orderid
        //Kiểm tra checksum của dữ liệu
        if ($secureHash == $vnp_SecureHash) {
            //Lấy thông tin đơn hàng lưu trong Database và kiểm tra trạng thái của đơn hàng, mã đơn hàng là: $payment_id
            //Việc kiểm tra trạng thái của đơn hàng giúp hệ thống không xử lý trùng lặp, xử lý nhiều lần một giao dịch

            $payment = Payment::where('id',$payments)->first();
            $payment_id=$payment->id;
            if ($payment != NULL) {
                if($payment["total_amount"] == $vnp_Amount) //Kiểm tra số tiền thanh toán của giao dịch: giả sử số tiền kiểm tra là đúng,
                {
                    if ($payment["status_id"] == 1) {
                        if ($inputData['vnp_ResponseCode'] == '00' || $inputData['vnp_TransactionStatus'] == '00') {
                            $Status = 3; // Trạng thái thanh toán thành công
                            $returnData['RspCode'] = '00';
                            $returnData['Message'] = 'Thanh toán thành công';
                        } else {
                            $Status = 6; // Trạng thái thanh toán thất bại / lỗi
                            $returnData['RspCode'] = '99';
                            $returnData['error'] = 'Thanh toán thất bại / lỗi';
                        }

                        //Cài đặt Code cập nhật kết quả thanh toán, tình trạng đơn hàng vào DB
                        Payment::where('id',$payment_id)->update(['status_id'=>$Status]);
                    } elseif($payment["status_id"] == 2) {
                        $returnData['RspCode'] = '02';
                        $returnData['Message'] = 'Đơn hàng đã được xác thực';
                    }
                    else {
                        // Trạng thái thanh toán thất bại / lỗi
                        Payment::where('id', $payment_id)->update(['status' => 6]);
                        $returnData['RspCode'] = '99';
                        $returnData['error'] = 'Thanh toán thất bại / lỗi';
                    }
                }
                else {
                    Payment::where('id', $payment_id)->update(['status' => 6]);
                    $returnData['RspCode'] = '04';
                    $returnData['Message'] = 'Số tiền không hợp lệ';
                }
            } else {
                $returnData['RspCode'] = '01';
                $returnData['Message'] = 'Không tìm thấy đơn hàng';
            }
        } else {
            $returnData['RspCode'] = '97';
            $returnData['Message'] = 'Chữ ký không hợp lệ';
        }
    } catch (Exception $e) {
        $returnData['RspCode'] = '99';
        $returnData['Message'] = 'Unknow error';
    }
    //Trả lại VNPAY theo định dạng JSON
        return response()->json($returnData);

    }
    public function vn_payment(Request $request)
    {

    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $payment = Payment::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'status_id' => 'required|integer|exists:status_payments,id',
        ]);

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
