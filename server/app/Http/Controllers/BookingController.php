<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Http\Requests\StoreBookingRequest;
use App\Http\Requests\UpdateBookingRequest;
use App\Models\Payment;
use App\Models\Room;
use App\Models\Service;
use App\Models\Voucher;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class BookingController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function listBooking(string $id)
    {
        $booking = Booking::find($id);

        $totalamount = 0;

        $subTotal_room = 0;

        $subTotal_service = 0;

        $startDate = Carbon::parse($booking->start_date);
        $endDate = Carbon::parse($booking->end_date);

        $days = max(1, $startDate->diffInDays($endDate));

        $room = Room::find($booking->room_id);

        $subTotal_room = $days * $room->price;

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


        //Tính tổng tiền
        $totalamount = $booking->total_amount = $subTotal_room + $subTotal_service;

        return response()->json([
            'booking' => $booking,
            'subTotal_service' => $subTotal_service,
            'subTotal_room' => $subTotal_room,
            'total_amount' => $totalamount,
            'room_id' => $booking->room_id,
            'start_date' => $booking->start_date,
            'end_date' => $booking->end_date
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
    public function addBooking(Request $request)
    {
        $validator = Validator::make(
            $request->all(),
            [
                'start_date' => [
                    'required',
                    'date',
                    'after_or_equal:' . now()->format('Y-m-d H:i:s')
                ],

                'end_date' => [
                    'required',
                    'date',
                    'after:start_date',
                    function ($attribute, $value, $fail) use ($request) {
                        $startDate = Carbon::parse($request->start_date);
                        $endDate = Carbon::parse($value);

                        if ($endDate->gt($startDate->addMonth())) {
                            $fail('Ngày kết thúc phải nằm trong vòng 1 tháng kể từ ngày bắt đầu.');
                        }
                    },
                ],

                'start_hour' => [
                    'required',
                ],

                'room_id' => 'required|exists:rooms,id',
            ],
            [
                'start_date.required' => 'Ngày bắt đầu không được để trống.',
                'start_date.date' => 'Ngày bắt đầu phải là một ngày hợp lệ.',
                'start_date.after_or_equal' => 'Ngày bắt đầu không thể là ngày trong quá khứ.',
                'end_date.required' => 'Ngày kết thúc không được để trống.',
                'end_date.date' => 'Ngày kết thúc phải là một ngày hợp lệ.',
                'end_date.after' => 'Ngày kết thúc phải sau ngày bắt đầu.',
                'start_hour.required' => 'Giờ bắt đầu không được để trống.',
                'room_id.required' => 'Phòng không được để trống',
                'room_id.exists' => 'Phòng phải tồn tại trong bảng phòng',
            ]
        );

        if ($validator->fails()) {
            return response()->json(['status' => 'error', 'message' => $validator->messages()], 400);
        }

        $allowedHours = ['09:00', '14:00'];
        if (!in_array($request->input('start_hour'), $allowedHours)) {
            return response()->json([
                'status' => 'error',
                'message' => 'Giờ bắt đầu chỉ được phép là 09:00 hoặc 14:00.'
            ], 400);
        }

        $startHour = $request->input('start_hour');
        $endHour = Carbon::parse($startHour)->addDay()->format('H:i'); // nếu dùng kiểu dl là time


        $roomID = $request->input('room_id');

        $room = Room::findOrFail($roomID);

        $finalQuantity = $room->quantity - $room->is_booked;

        if ($finalQuantity <= 0) {
            return response()->json(['message' => 'Phòng đã hết'], 400);
        }

        $booking = Booking::create([
            'room_id' => $room->id,
            'start_date' => $request->input('start_date'),
            'end_date' => $request->input('end_date'),
            'voucher_id' => $request->input('voucher_id'),
            'start_hour' => $startHour,
            'end_hour' => $endHour,

        ]);


        //Kiểm tra nếu có dịch vụ (service_ids k null)
        if ($request->filled('service_ids')) {
            $serviceIDs = json_decode($request->input('service_ids'), true);

            $serviceData = [];

            foreach ($serviceIDs as $index => $serviceID) {
                $service = Service::findOrFail($serviceID);

                $serviceData[$serviceID] = [
                    'price' => $service->price
                ];
            }

            $booking->services()->attach($serviceData);
        }

        return response()->json([
            'message' => 'Thêm đơn đặt thàng công!',
            'booking' => $booking,
            'booking_id' => $booking->id,
            'services' => $serviceData ?? []
        ]);
    }
    // {
    //     $validator = Validator::make(
    //         $request->all(),
    //         [
    //             'start_date' => [
    //                 'required',
    //                 'date',
    //                 'after_or_equal:' . now()->format('Y-m-d H:i:s')
    //             ],
    //             'end_date' => [
    //                 'required',
    //                 'date',
    //                 'after:start_date',
    //                 function ($attribute, $value, $fail) use ($request) {
    //                     $startDate = Carbon::parse($request->start_date);
    //                     $endDate = Carbon::parse($value);

    //                     if ($endDate->gt($startDate->addMonth())) {
    //                         $fail('Ngày kết thúc phải nằm trong vòng 1 tháng kể từ ngày bắt đầu.');
    //                     }
    //                 },
    //             ],
    //             'start_hour' => [
    //                 'required',
    //                 'in:09:00,14:00', // Chỉ cho phép 09:00 hoặc 14:00
    //             ],
    //             'room_id' => 'required|exists:rooms,id',
    //         ],
    //         [
    //             'start_date.required' => 'Ngày bắt đầu không được để trống.',
    //             'start_date.date' => 'Ngày bắt đầu phải là một ngày hợp lệ.',
    //             'start_date.after_or_equal' => 'Ngày bắt đầu không thể là ngày trong quá khứ.',
    //             'end_date.required' => 'Ngày kết thúc không được để trống.',
    //             'end_date.date' => 'Ngày kết thúc phải là một ngày hợp lệ.',
    //             'end_date.after' => 'Ngày kết thúc phải sau ngày bắt đầu.',
    //             'start_hour.required' => 'Giờ bắt đầu không được để trống.',
    //             'start_hour.in' => 'Giờ bắt đầu chỉ có thể là 09:00 hoặc 14:00.',
    //             'room_id.required' => 'Phòng không được để trống.',
    //             'room_id.exists' => 'Phòng phải tồn tại trong bảng phòng.',
    //         ]
    //     );

    //     if ($validator->fails()) {
    //         return response()->json(['status' => 'error', 'message' => $validator->messages()], 400);
    //     }

    //     $startHour = $request->input('start_hour');
    //     $endHour = Carbon::parse($startHour)->addDay()->format('H:i'); // nếu dùng kiểu dl là time

    //     // $startHour = Carbon::parse($request->start_date . ' ' . $request->start_hour);
    //     // $endHour = $startHour->addDay(); // nếu dùng dl datetime


    //     $roomID = $request->input('room_id');
    //     $room = Room::findOrFail($roomID);

    //     $booking = Booking::create([
    //         'room_id' => $room->id,
    //         'start_date' => $request->input('start_date'),
    //         'end_date' => $request->input('end_date'),
    //         'start_hour' => $startHour, //
    //         'end_hour' => $endHour, //
    //         'voucher_id' => $request->input('voucher_id')
    //     ]);

    //     // Kiểm tra nếu có dịch vụ (service_ids không null)
    //     if ($request->filled('service_ids')) {
    //         $serviceIDs = json_decode($request->input('service_ids'), true);

    //         $serviceData = [];
    //         foreach ($serviceIDs as $index => $serviceID) {
    //             $service = Service::findOrFail($serviceID);
    //             $serviceData[$serviceID] = ['price' => $service->price];
    //         }
    //         $booking->services()->attach($serviceData);
    //     }

    //     return response()->json([
    //         'message' => 'Thêm đơn đặt thành công!',
    //         'booking' => $booking,
    //         'booking_id' => $booking->id,
    //         'services' => $serviceData ?? []
    //     ]);
    // }


    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $booking = Booking::with(['room', 'voucher', 'services'])
            ->where('id', $id)
            ->whereNull('deleted_at')
            ->first();

        if ($booking) {
            return response()->json([
                'booking' => $booking,
                'room' => $booking->room,
                'services' => $booking->services,
                'voucher' => $booking->voucher,
            ]);
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

        $booking = Booking::find($id);

        if (!$booking) {
            return response()->json(['message' => 'Không tìm thấy bookings'], 404);
        }


        $booking->update($request->all());

        return response()->json(['message' => 'Cập nhật đặt phòng thành công!', 'booking' => $booking], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {

        $booking = Booking::find($id);
        if (!$booking) {
            return response()->json(['message' => 'Không tìm thấy bookings'], 404);
        }

        $booking->delete();

        return response()->json(['message' => 'Xóa đặt phòng thành công!'], 200);
    }

    public function checkRoomQuantity(string $id)
    {
        $room = Room::find($id);

        if (!$room) {
            return response()->json(['message' => 'Không tìm thấy phòng'], 404);
        }

        $finalQuantity = $room->quantity - $room->is_booked;

        return response()->json([
            'room_id' => $room->id,
            'quantity' => $finalQuantity,
            'status' => $finalQuantity > 0 ? 'Còn phòng' : 'Hết phòng',
        ]);
    }


    public function getAvailableRooms(Request $request)
    {
        $data = $request->all();

        $startDate = Carbon::parse($data['startDate']);
        $endDate = Carbon::parse($data['endDate']);
        $roomId = $data['room_id'] ?? null; // ID phòng được truyền vào (nếu có)

        if ($startDate > $endDate) {
            return response()->json(['error' => 'Ngày bắt đầu phải nhỏ hơn hoặc bằng ngày kết thúc.'], 422);
        }

        // Lấy danh sách phòng đã được đặt, lọc theo room_id nếu được truyền vào
        $bookedRooms = Booking::join('payments', 'payments.booking_id', '=', 'bookings.id')
            ->where(function ($query) use ($startDate, $endDate) {
                $query->whereBetween('bookings.start_date', [$startDate, $endDate])
                    ->orWhereBetween('bookings.end_date', [$startDate, $endDate])
                    ->orWhere(function ($query) use ($startDate, $endDate) {
                        $query->where('bookings.start_date', '<=', $startDate)
                            ->where('bookings.end_date', '>=', $endDate);
                    });
            });

        if ($roomId) {
            $bookedRooms->where('bookings.room_id', $roomId); // Lọc theo room_id nếu có
        }

        $bookedRooms = $bookedRooms
            ->select('bookings.room_id', DB::raw('COUNT(bookings.room_id) as booked_quantity'))
            ->groupBy('bookings.room_id')
            ->pluck('booked_quantity', 'bookings.room_id');

        // Nếu truyền room_id, chỉ trả về thông tin phòng đó
        if ($roomId) {
            $room = Room::select('id', 'quantity')
                ->where('id', $roomId)
                ->first();

            if (!$room) {
                return response()->json(['error' => 'Phòng không tồn tại.'], 404);
            }

            $bookedQuantity = $bookedRooms[$room->id] ?? 0;
            $availableQuantity = $room->quantity - $bookedQuantity;

            return response()->json([
                'room_id' => $room->id,
                'total_quantity' => $room->quantity,
                'available_quantity' => $availableQuantity,
            ]);
        }

        // Lấy danh sách tất cả các phòng nếu không có room_id
        $rooms = Room::select('id',  'quantity')
            ->get()
            ->map(function ($room) use ($bookedRooms) {
                $bookedQuantity = $bookedRooms[$room->id] ?? 0;
                $room->available_quantity = $room->quantity - $bookedQuantity;
                return $room;
            });

        return response()->json($rooms);
    }

}

    public function addBookingPayAd(Request $request)
    {
        DB::beginTransaction();
        try {

            // $validator = Validator::make($request->all(), [
            //     //Booking
            //     'start_date' => [
            //         'required',
            //         'date',
            //         'after_or_equal:' . now()->format('Y-m-d H:i:s')
            //     ],

            //     'end_date' => [
            //         'required',
            //         'date',
            //         'after:start_date',
            //         function ($attribute, $value, $fail) use ($request) {
            //             $startDate = Carbon::parse($request->start_date);
            //             $endDate = Carbon::parse($value);

            //             if ($endDate->gt($startDate->addMonth())) {
            //                 $fail('Ngày kết thúc phải nằm trong vòng 1 tháng kể từ ngày bắt đầu.');
            //             }
            //         },
            //     ],

            //     'start_hour' => [
            //         'required',
            //     ],

            //     'room_id' => 'required|exists:rooms,id',

            //     //Payment
            //     'pet_name' => 'required|string|max:255',
            //     'pet_type' => 'required|string|max:255',
            //     'pet_description' => 'required|string',
            //     'pet_health' => 'required|string',
            //     'user_name' => 'required|string|max:255',
            //     'user_address' => 'required|string|max:255',
            //     'user_email' => 'required|email|max:255',
            //     'user_phone' => 'required|string|max:15',
            //     'user_id' => 'exists:users,id',
            //     'paymethod_id' => 'required|exists:paymethods,id',
            // ]);

            // if ($validator->fails()) {
            //     return response()->json(['status' => 'error', 'message' => $validator->messages()], 400);
            // }

            // tao booking
            $allowedHours = ['09:00', '14:00'];
            if (!in_array($request->input('start_hour'), $allowedHours)) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Giờ bắt đầu chỉ được phép là 09:00 hoặc 14:00.'
                ], 400);
            }

            $startHour = $request->input('start_hour');
            $endHour = Carbon::parse($startHour)->addDay()->format('H:i'); // nếu dùng kiểu dl là time

            $roomID = $request->input('room_id');

            $room = Room::findOrFail($roomID);

            $finalQuantity = $room->quantity - $room->is_booked;

            if ($finalQuantity <= 0) {
                return response()->json(['message' => 'Phòng đã hết'], 400);
            }

            $booking = Booking::create([
                'room_id' => $room->id,
                'start_date' => $request->input('start_date'),
                'end_date' => $request->input('end_date'),
                'voucher_id' => $request->input('voucher_id'),
                'start_hour' => $startHour,
                'end_hour' => $endHour,

            ]);

            if ($request->filled('service_ids')) {
                $serviceIDs = json_decode($request->input('service_ids'), true);

                $serviceData = [];

                foreach ($serviceIDs as $index => $serviceID) {
                    $service = Service::findOrFail($serviceID);

                    $serviceData[$serviceID] = [
                        'price' => $service->price
                    ];
                }

                $booking->services()->attach($serviceData);
            }

            DB::commit();

            // Gắn các dịch vụ (nếu có)
            if ($request->has('services') && is_array($request->services)) {
                $booking->services()->attach($request->services);
            }

            // tao pay   
            if ($booking) {
                $subTotal_service = 0;
                $subTotal_room = 0;

                $startDate = Carbon::parse($booking->start_date);
                $endDate = Carbon::parse($booking->end_date);
                $days = max(1, $startDate->diffInDays($endDate));

                // Tính tiền phòng
                $subTotal_room += $booking->room->price * $days;

                // Tính tiền dịch vụ
                if ($booking->services && $booking->services->isNotEmpty()) {
                    foreach ($booking->services as $service) {
                        if ($service->id === 2) {
                            $quantity = max(1, floor($days / 3));
                            $subTotal_service += $service->price * $quantity;
                        } else {
                            $subTotal_service += $service->price;
                        }
                    }
                }

                $total_amount = $subTotal_room + $subTotal_service;

                $paymentData = [
                    'booking_id' => $booking->id,
                    'user_id' => $request->input('user_id'),
                    'paymethod_id' => $request->input('paymethod_id'),
                    'pet_name' => $request->input('pet_name'),
                    'pet_type' => $request->input('pet_type'),
                    'pet_description' => $request->input('pet_description'),
                    'pet_health' => $request->input('pet_health'),
                    'user_name' => $request->input('user_name'),
                    'user_address' => $request->input('user_address'),
                    'user_email' => $request->input('user_email'),
                    'user_phone' => $request->input('user_phone'),
                    'total_amount' => $total_amount,
                    'status_id' => 2,
                ];

                $room = $booking->room;

                if ($room->quantity > 0) {
                    $room->increment('is_booked', 1);

                    if ($room->quantity === $room->is_booked) {
                        $room->update(['statusroom' => 'Hết phòng']);
                    }
                } else {
                    return response()->json(['error' => 'Phòng đã hết, vui lòng chọn phòng khác'], 400);
                }
                $payment = Payment::create($paymentData);

                DB::commit();
            }

            return response()->json([
                'status' => 'success',
                'message' => 'Booking và Payment đã được thêm thành công!',
                'booking' => $booking,
            ]);
        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'status' => 'error',
                'message' => 'Có lỗi xảy ra trong quá trình xử lý.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}

