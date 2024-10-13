<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Http\Requests\StoreBookingRequest;
use App\Http\Requests\UpdateBookingRequest;
use App\Models\Room;
use App\Models\Service;
use App\Models\Voucher;
use Carbon\Carbon;
use Dotenv\Validator;
use Illuminate\Http\Request;

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

        // Tính khoảng cách ngày
        $days = max(1, $startDate->diffInDays($endDate));

        //Tính tổng tiền phòng
        $room = Room::find($booking->room_id);

        $subTotal_room = $days * $room->price;

        //Tính tổng tiền dịch vụ
        $services = $booking->services; // Lấy tất cả dịch vụ liên quan đến booking

        foreach ($services as $item) {
            // Tính tổng tiền cho từng dịch vụ và cộng dồn
            $subTotal_service += $item->price * $item->pivot->quantity;
        }

        $subTotal_voucher = 0;


        if ($booking->voucher_id) {
            $voucher = Voucher::find($booking->voucher_id);
            if ($voucher) {
                $subTotal_voucher = $voucher->discount;
            }
        }

        //Tính tổng tiền
        $totalamount = $booking->total_amount = $subTotal_room + $subTotal_service - $subTotal_voucher;

        return response()->json([
            'booking' => $booking,
            'subTotal_service' => $subTotal_service,
            'subTotal_room' => $subTotal_room,
            'subTotal_voucher' => $subTotal_voucher,
            'total_amount' => $totalamount
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
        // check đăng nhập hay chưa, nếu chưa thì mời đăng nhập
        // if (!auth()->check()) {
        //     // Chuyển hướng người dùng đến trang đăng nhập
        //     return redirect()->route('login')->with('message', 'Đăng nhập để đặt phòng');
        // }

        $roomID = $request->input('room_id');

        //Tìm thông tin phòng
        $room = Room::findOrFail($roomID);

        //Tạo một booking mới và lưu vào CSDL
        $booking = Booking::create([
            'room_id' => $room->id,
            'start_date' => $request->input('start_date'),
            'end_date' => $request->input('end_date'),
        ]);


        //Kiểm tra nếu có dịch vụ (service_ids k null)
        if ($request->filled('service_ids') && $request->filled('quantities')) {
            $serviceIDs = $request->input('service_ids'); // Mảng chứa các dịch vụ
            $quantities = $request->input('quantities'); // Mảng chứa số lượng dịch vụ

            $serviceData = []; // mảng lưu dữ liệu bảng booking_services

            foreach ($serviceIDs as $index => $serviceID) {
                $service = Service::findOrFail($serviceID); //tìm dịch vụ theo id

                 // Thêm vào mảng servicesData với các thông tin cần thiết
                $serviceData[$serviceID] = [
                    'quantity' => $quantities[$index], // Số lượng của dịch vụ từ request
                    'price' => $service->price,        // Giá của dịch vụ
                ];

            }

            $booking->services()->attach($serviceData);
    
        }
       
        return response()->json([
            'message' => 'Thêm đơn đặt thàng công!',
            'booking' => $booking,
            'services' => $serviceData ?? [] // Trả về mảng rỗng nếu không có dịch vụ
        ]);

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
        if ($booking) {
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
    public function update(Request $request, string $id)
    {
        // Tìm booking theo ID
        $booking = Booking::find($id);

        if (!$booking) {
            return response()->json(['message' => 'Không tìm thấy bookings'], 404);
        }

        // Cập nhật dữ liệu booking
        $booking->update($request->all());
        // Trả về phản hồi JSON
        return response()->json(['message' => 'Cập nhật đặt phòng thành công!', 'booking' => $booking], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        // Tìm booking theo ID
        $booking = Booking::find($id);
        if (!$booking) {
            return response()->json(['message' => 'Không tìm thấy bookings'], 404);
        }
        // Xóa mềm (soft delete)
        $booking->delete();
        // Trả về phản hồi JSON
        return response()->json(['message' => 'Xóa đặt phòng thành công!'], 200);
    }
}
