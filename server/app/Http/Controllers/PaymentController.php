<?php

namespace App\Http\Controllers;

use App\Mail\PaymentConfirm;
use App\Models\Payment;
use App\Http\Requests\StorePaymentRequest;
use App\Http\Requests\UpdatePaymentRequest;
use App\Models\Booking;
use App\Models\Room;
use App\Models\Status;
use App\Models\Voucher;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Mail;
use App\Mail\OrderConfirmation;
use App\Models\Pay_return;

class PaymentController extends Controller
{
    /**
     * Display a listing of the resource.
     */

    public function index(String $id)
    {
        $payments = Payment::with(['status', 'booking.room.size', 'user', 'voucher', 'payMethod'])
            ->where('user_id', $id)
            ->whereNull('deleted_at')
            ->orderBy('id', 'desc')
            ->get();

        $user = $payments->isNotEmpty() ? $payments->first()->user_id : null;

        $bookings = [];
        $rooms = [];
        $vouchers = [];
        $payMethods = [];


        foreach ($payments as $payment) {
            if ($payment->booking) {
                $bookings[] = $payment->booking;
                $rooms[] = [
                    'room' => $payment->booking->room,
                    'size_name' => $payment->booking->room->size->name ?? null,
                ];
            }

            if ($payment->payMethod) {
                $payMethods[] = [
                    'payMethod_name' => $payment->payMethod->name ?? 'No name',
                ];
            } else {
                $payMethods[] = [
                    'payMethod_name' => 'No pay method',
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
                'payMethod' => $payMethods,
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




    public function updatePaymentDetails(Request $request, $id)
    {
        $validator = Validator::make(
            $request->all(),
            [
                'room_id' => 'exists:rooms,id', // Kiểm tra room_id hợp lệ
            ],
            [
                'room_id.exists' => 'Phòng được chọn không hợp lệ.',
            ]
        );

        if ($validator->fails()) {
            return response()->json(['status' => 'error', 'message' => $validator->messages()], 400);
        }

        DB::beginTransaction();
        try {
            // Lấy thông tin thanh toán
            $payment = Payment::findOrFail($id);


            $booking = Booking::find($payment->booking_id);
            if (!$booking) {
                return response()->json(['status' => 'error', 'message' => 'Không tìm thấy thông tin booking.'], 404);
            }

            $fieldsToUpdate = [];
            $totalAmountOld = $payment->total_amount; // Lưu lại tổng tiền cũ

            // // Nếu có yêu cầu thay đổi thông tin
            // if ($request->has('pet_name')) {
            //     $fieldsToUpdate['pet_name'] = $request->input('pet_name');
            // }
            // if ($request->has('pet_type')) {
            //     $fieldsToUpdate['pet_type'] = $request->input('pet_type');
            // }
            // if ($request->has('pet_description')) {
            //     $fieldsToUpdate['pet_description'] = $request->input('pet_description');
            // }
            // if ($request->has('pet_health')) {
            //     $fieldsToUpdate['pet_health'] = $request->input('pet_health');
            // }


            if ($request->has('room_id')) {
                $newRoomId = $request->input('room_id');
                $oldRoomId = $booking->room_id;

                // Kiểm tra phòng mới có sẵn không
                $newRoom = Room::find($newRoomId);
                if ($newRoom->quantity <= $newRoom->is_booked) {
                    return response()->json(['status' => 'error', 'message' => 'Phòng đã đầy, vui lòng chọn phòng khác.'], 400);
                }

                // Cập nhật số lượng phòng
                $oldRoom = Room::find($oldRoomId);
                if ($oldRoom) {
                    $oldRoom->decrement('is_booked', 1);
                    if ($oldRoom->is_booked < $oldRoom->quantity) {
                        $oldRoom->update(['statusroom' => 'Còn phòng']);
                    }
                }

                $newRoom->increment('is_booked', 1);
                if ($newRoom->is_booked === $newRoom->quantity) {
                    $newRoom->update(['statusroom' => 'Hết phòng']);
                }


                $booking->update(['room_id' => $newRoomId]);
                $fieldsToUpdate['room_id'] = $newRoomId;
            }

            // Tính lại tổng tiền mới
            $startDate = Carbon::parse($booking->start_date);
            $endDate = Carbon::parse($booking->end_date);
            $days = max(1, $startDate->diffInDays($endDate));

            $subTotalRoom = $booking->room->price * $days;
            $subTotalService = 0;

            if ($booking->services && $booking->services->isNotEmpty()) {
                foreach ($booking->services as $item) {
                    if ($item->id === 2) {
                        $quantity = max(1, floor($days / 3));
                        $subTotalService += $item->price * $quantity;
                    } else {
                        $subTotalService += $item->price;
                    }
                }
            }

            $totalAmountNew = $subTotalRoom + $subTotalService;
            $fieldsToUpdate['total_amount'] = $totalAmountNew;


            $difference = $totalAmountNew - $totalAmountOld;


            if ($difference <= 0) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Số tiền thanh toán mới phải lớn hơn số tiền cũ.',
                    'difference' => $difference,
                ], 400);
            }
            $fieldsToUpdate['different_amount'] = $difference;
            $payment->update($fieldsToUpdate);

            DB::commit();

            return response()->json([
                'status' => 'success',
                'message' => 'Cập nhật thông tin thanh toán thành công.',
                'data' => [
                    'payment_id' => $payment->id,
                    'updated_fields' => $fieldsToUpdate,
                    'difference' => $difference,
                ],
            ], 200);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['status' => 'error', 'message' => 'Xảy ra lỗi trong quá trình cập nhật.', 'error' => $e->getMessage()], 500);
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
    public function vn_payment(Request $request)
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
                            $percentageDiscount = ($total_amount * $voucher->discount) / 100;
                            $discount = min($percentageDiscount, $voucher->max_total_amount);
                        } else {
                            $discount = min($voucher->discount, $total_amount);
                        }

                        $totalAmount = max(0, $total_amount - $discount);

                        $params['total_amount'] = $totalAmount;
                    } else {
                        $params['total_amount'] = $total_amount;
                    }
                }


                // Mặc định status_id = 3 khi thêm

                $params['status_id'] = $params['status_id'] ?? 3;

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


                DB::commit();

                //thanh toasn on
                error_reporting(E_ALL & ~E_NOTICE & ~E_DEPRECATED);
                date_default_timezone_set('Asia/Ho_Chi_Minh');
                $startTime = date("YmdHis");
                $expire = date('YmdHis', strtotime('+15 minutes', strtotime($startTime)));
                $vnp_Url = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
                $vnp_Returnurl = "http://localhost:5173/check_pay";
                $vnp_TmnCode = "O4XUI4RI"; //Mã website tại VNPAY
                $vnp_HashSecret = "76Y95K5BK7Q2AIQADYYS3YSQ3XQ6D68F"; //Chuỗi bí mật

                $vnp_TxnRef = $payment->id; //Mã đơn hàng. Trong thực tế Merchant cần insert đơn hàng vào DB và gửi mã này sang VNPAY
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
                    $vnpSecureHash =   hash_hmac('sha512', $hashdata, $vnp_HashSecret); //
                    $vnp_Url .= 'vnp_SecureHash=' . $vnpSecureHash;
                }
                $returnData = array(
                    'code' => '00',
                    'message' => 'success',
                    'data' => $vnp_Url
                );
                //                    if (isset($_POST['redirect'])) {
                //                        header('Location: ' . $vnp_Url);
                //                        die();
                //                    } else {
                //                        echo json_encode($returnData);
                //                    }
                // vui lòng tham khảo thêm tại code demo
                return response()->json([
                    'status' => 'success',
                    'vnp_Url' => $vnp_Url,
                ]);
            } catch (\Exception $e) {
                DB::rollBack();

                return response()->json(['status' => 'Xảy ra lỗi trong quá trình thanh toán. Vui lòng thử lại!', 'message' => $e->getMessage()], 500);
            }
        }
    }
    public function check_payment(Request $request)
    {

        $inputData = array();
        $returnData = array();
        $vnp_HashSecret = "76Y95K5BK7Q2AIQADYYS3YSQ3XQ6D68F";
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
        $vnp_Amount = $inputData['vnp_Amount'] / 100; // Số tiền thanh toán VNPAY phản hồi

        $Status = 0; // Là trạng thái thanh toán của giao dịch chưa có IPN lưu tại hệ thống của merchant chiều khởi tạo URL thanh toán.
        $payments = $inputData['vnp_TxnRef'];

        try {
            $payment = Payment::where('id', $payments)->first();
            $payment_id = $payment->id;
            //Check Orderid
            //Kiểm tra checksum của dữ liệu
            if ($secureHash == $vnp_SecureHash) {
                //Lấy thông tin đơn hàng lưu trong Database và kiểm tra trạng thái của đơn hàng, mã đơn hàng là: $payment_id
                //Việc kiểm tra trạng thái của đơn hàng giúp hệ thống không xử lý trùng lặp, xử lý nhiều lần một giao dịch

                $payment = Payment::where('id', $payments)->first();
                $payment_id = $payment->id;
                if ($payment != NULL) {
                    if ($payment["total_amount"] == $vnp_Amount) //Kiểm tra số tiền thanh toán của giao dịch: giả sử số tiền kiểm tra là đúng,
                    {
                        if ($payment["status_id"] == 3) {
                            if ($inputData['vnp_ResponseCode'] == '00' || $inputData['vnp_TransactionStatus'] == '00') {
                                Payment::where('id', $payment_id)->update(['status_id' => 4]);
                                $returnData['RspCode'] = '00';
                                $returnData['Message'] = 'Thanh toán thành công';
                                $data = "
                                Khach hang: {$payment->user_name}
                                Email: {$payment->user_email}
                                So dien thoai: {$payment->user_phone}
                                Ma thanh toan: {$payment->id}
                                Ten thu cung: {$payment->pet_name}
                                Chung loai: {$payment->pet_type}
                                Ngay check-in: {$payment->booking->start_date}
                                Ngay check-out: {$payment->booking->end_date}
                                Tong tien: {$payment->total_amount}
                                ";

                                function removeVietnameseAccent($str)
                                {
                                    $trans = array(
                                        'a' => 'áàảãạăắằẳẵặâấầẩẫậ',
                                        'e' => 'éèẻẽẹêếềểễệ',
                                        'i' => 'íìỉĩị',
                                        'o' => 'óòỏõọôốồổỗộơớờởỡợ',
                                        'u' => 'úùủũụưứừửữự',
                                        'y' => 'ýỳỷỹỵ',
                                        'd' => 'đ',
                                    );

                                    foreach ($trans as $key => $value) {
                                        $str = preg_replace("/[" . $value . "]/u", $key, $str);
                                    }
                                    return $str;
                                }

                                $data = "Khách hàng: {$payment->user_name}
                                Email: {$payment->user_email}
                                Số điện thoại: {$payment->user_phone}
                                Mã thanh toán: {$payment->id}
                                Tên thú cưng: {$payment->pet_name}
                                Chủng loại: {$payment->pet_type}
                                Ngày check-in: {$payment->booking->start_date}
                                Ngày check-out: {$payment->booking->end_date}
                                Tổng tiền: {$payment->total_amount}";

                                // Chuyển thành không dấu
                                $dataNoAccent = removeVietnameseAccent($data);

                                // Cải thiện trình bày bằng cách sử dụng các dấu ngắt dòng, thêm khoảng cách hoặc ký tự đặc biệt nếu cần.
                                $formattedData = "
                                ----------------------------
                                THONG TIN THANH TOAN
                                ----------------------------
                                Khach hang: {$payment->user_name}
                                Email: {$payment->user_email}
                                So dien thoai: {$payment->user_phone}
                                Ma thanh toan: {$payment->id}
                                Ten thu cung: {$payment->pet_name}
                                Chung loai: {$payment->pet_type}
                                Ngay check-in: {$payment->booking->start_date}
                                Ngay check-out: {$payment->booking->end_date}
                                Tong tien: {$payment->total_amount} VND
                                ----------------------------
                                ";

                                // Call external API to generate QR code image (in PNG format)
                                $qrCodeUrl = "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=" . urlencode($formattedData);

                                // Send email with QR code
                                Mail::to($payment->user->email)->send(new PaymentConfirm($payment, qrCodeUrl: $qrCodeUrl));
                            } else {
                                $payment->delete();
                                $returnData['RspCode'] = '99';
                                $returnData['error'] = 'Thanh toán thất bại / lỗi';
                            }
                        } elseif ($payment["status_id"] == 2) {
                            $returnData['RspCode'] = '02';
                            $returnData['Message'] = 'Đơn hàng đã được xác thực';
                        }
                        //                        else {
                        //                            // Trạng thái thanh toán thất bại / lỗi
                        //                            Payment::where('id', $payment_id)->update(['status_id' => 4]);
                        //                            $returnData['RspCode'] = '99';
                        //                            $returnData['error'] = 'Thanh toán thất bại / lỗi';
                        //                        }
                    } else {
                        $payment->delete();
                        $returnData['RspCode'] = '04';
                        $returnData['Message'] = 'Số tiền không hợp lệ';
                    }
                } else {
                    $payment->delete();
                    $returnData['RspCode'] = '01';
                    $returnData['Message'] = 'Không tìm thấy đơn hàng';
                }
            } else {
                $payment->delete();
                $returnData['RspCode'] = '97';
                $returnData['Message'] = 'Chữ ký không hợp lệ';
            }
        } catch (\Exception $e) {
            $payment->delete();
            $returnData['RspCode'] = '99';
            $returnData['Message'] = 'Unknow error';
        }
        //Trả lại VNPAY theo định dạng JSON
        return response()->json($returnData);
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

    public function cancelPay(string $id)
    {
        $payment = Payment::find($id);

        if (!$payment) {
            return response()->json(['message' => 'Payment không tồn tại!'], 404);
        }


        $day = Carbon::parse($payment->created_at);
        $now = Carbon::now();


        if ($day->diffInDays($now) > 2) {
            return response()->json(['message' => 'Không thể hủy đơn hàng sau 2 ngày!'], 403);
        }

        if ($payment->status_id > 4) {
            return response()->json(['message' => 'Không thể hủy đơn hàng!'], status: 403);
        }


        $payment->update(['status_id' => 7]);

        return response()->json(['message' => 'Thanh toán đã được hủy!', 'payment' => $payment], 200);
    }

    public function cancelPayAd(string $id)
    {
        $payment = Payment::find($id);

        if (!$payment) {
            return response()->json(['message' => 'Payment không tồn tại!'], 404);
        }

        $booking = $payment->booking;

        if (!$booking) {
            return response()->json(['message' => 'Booking không tồn tại!'], 404);
        }

        $start_date = Carbon::parse($booking->start_date)->setTimezone('Asia/Ho_Chi_Minh');

        $start_hour = Carbon::createFromFormat(
            'H:i:s',
            $booking->start_hour,
            'Asia/Ho_Chi_Minh'
        );

        $now = Carbon::now('Asia/Ho_Chi_Minh');

        if (!$now->isSameDay($start_date)) {
            return response()->json(['message' => 'Ngày thanh toán không trùng ngày với ngày check-in!'], 400);
        }

        if ($now->lessThan($start_hour->addHours(3))) {
            return response()->json([
                'message' => 'Không thể hủy thanh toán trước 3 tiếng kể từ giờ check-in!',
                'start_hour' => $start_hour->format('H:i:s'),
                'current_time' => $now->format('H:i:s'),
            ], 400);
        }

        $payment->update(['status_id' => 7]);

        return response()->json(['message' => 'Thanh toán đã được hủy!', 'payment' => $payment], 200);
    }

    public function checkOut(Request $request, $id)
    {

        $payment = Payment::findOrFail($id);

        if (!$payment) {
            return response()->json(['message' => 'Payment không tồn tại!'], 404);
        }

        $booking = $payment->booking;

        if (!$booking) {
            return response()->json(['message' => 'Booking không tồn tại!'], 404);
        }

        $actualCheckOutTime = $request->input('actual_check_out_time');

        if (!$actualCheckOutTime) {

            $actualTime = Carbon::now('Asia/Ho_Chi_Minh');
        } else {

            $actualTime = Carbon::parse($actualCheckOutTime)->setTimezone('Asia/Ho_Chi_Minh');
        }

        $checkOutTime = Carbon::parse($booking->end_date . ' ' . $booking->end_hour)->setTimezone('Asia/Ho_Chi_Minh');

        if ($actualTime->lessThanOrEqualTo($checkOutTime)) {
            return response()->json([
                'message' => 'Vẫn đang đúng giờ quy định, không có phụ thu!',
                'room_rate' => $payment->total_amount,
                'lateCheckOut' => 0,
            ], 200);
        }

        $minutesLate = $actualTime->diffInMinutes($checkOutTime);

        if ($minutesLate < 180) {
            return response()->json([
                'message' => 'Trả phòng muộn dưới 3 tiếng, không có phụ thu!',
                'room_rate' => $payment->total_amount,
                'lateCheckOut' => 0,
            ], 200);
        }

        // Nếu muộn hơn 3 giờ, tính phí phụ thu
        $lateCheckOut = 500000;

        // Tính tổng số tiền bao gồm phụ thu
        $total = $payment->total_amount + $lateCheckOut;

        return response()->json([
            'message' => 'Tính phí trả phòng muộn thành công!',
            'room' => $booking->room,
            'lateCheckOut' => $lateCheckOut,
            'total' => $total,
        ], 200);
    }
}
