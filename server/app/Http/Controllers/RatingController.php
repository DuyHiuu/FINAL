<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Models\Rating;
use App\Models\Room;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class RatingController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $rating = Rating::with('room')->get(); // lấy tất cả ratings cùng với thông tin room

        return response()->json([
            'success' => true,
            'message' => 'Lấy dữ liệu thành công!.',
            'data' => $rating,
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
    // public function store(Request $request, $room_id)
    // {
    //     $request->validate([
    //         'rating' => 'required|integer|min:1|max:5',
    //     ]);

    //     // Kiểm tra xem người dùng đã đánh giá phòng này chưa
    //     $existingRating = Rating::where('room_id', $room_id)->where('user_id', auth()->id())->first();
    //     if ($existingRating) {
    //         // Cập nhật đánh giá nếu người dùng đã đánh giá
    //         $existingRating->update(['rating' => $request->rating]);
    //     } else {
    //         // Tạo mới nếu người dùng chưa đánh giá
    //         Rating::create([
    //             'room_id' => $room_id,
    //             'user_id' => auth()->id(),
    //             'rating' => $request->rating,
    //         ]);
    //     }

    //     return response()->json(['status' => 'success', 'message' => 'Đánh giá thành công!']);
    // }

    public function store(Request $request)
    {
        // Xác thực dữ liệu đầu vào
        $validator = Validator::make($request->all(), [
            'rating' => 'required|integer|min:1|max:5',
            'content' => 'required|string|max:1000',
            'room_id' => 'required|integer|exists:rooms,id',
        ]);

        // Nếu xác thực thất bại, trả về lỗi
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Kiểm tra nếu người dùng đã đặt phòng và hoàn thành thanh toán cho room_id
        $user = auth()->user(); // Lấy người dùng hiện tại
        $hasCompletedBooking = Booking::where('room_id', $request->room_id)
            ->where('user_id', $user->id)
            ->where('status', 'completed') // 'status' là trạng thái thanh toán hoàn thành
            ->exists();

        if (!$hasCompletedBooking) {
            return response()->json([
                'status' => 'error',
                'message' => 'Bạn chỉ có thể đánh giá sau khi hoàn tất đặt phòng và thanh toán!.'
            ], 403);
        }

        // Bắt đầu transaction để đảm bảo tính toàn vẹn dữ liệu
        DB::beginTransaction();

        try {
            // Tạo mới rating
            $rating = new Rating();
            $rating->rating = $request->rating;
            $rating->content = $request->content;
            $rating->user_id = $user->id;
            $rating->room_id = $request->room_id;
            $rating->save(); // Lưu đánh giá vào cơ sở dữ liệu

            DB::commit(); // Hoàn thành transaction

            return response()->json([
                'status' => 'success',
                'message' => 'Đánh giá đã được lưu thành công!',
                'rating' => $rating
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack(); // Rollback nếu có lỗi

            return response()->json([
                'status' => 'error',
                'message' => 'Xảy ra lỗi trong quá trình đánh giá. Vui lòng thử lại!',
                'error' => $e->getMessage()
            ], 500);
        }
    }


    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        // Lấy danh sách đánh giá cho room_id cụ thể, cùng với thông tin room
        $ratings = Rating::where('room_id', $id)->with('room')->get();

        // Kiểm tra nếu không có đánh giá nào cho room_id
        if ($ratings->isEmpty()) {
            return response()->json([
                'success' => false,
                'message' => 'Không có đánh giá nào cho phòng này!.',
                'data' => [],
            ]);
        }

        return response()->json([
            'success' => true,
            'message' => 'Lấy dữ liệu thành công neek!',
            'data' => $ratings,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        // Xác thực dữ liệu đầu vào
        $validator = Validator::make($request->all(), [
            'rating' => 'required|integer|min:1|max:5',
            'content' => 'required|string|max:1000',
        ]);

        // Nếu xác thực thất bại, trả về lỗi
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Tìm đánh giá dựa trên ID
        $rating = Rating::find($id);

        // Kiểm tra nếu đánh giá không tồn tại
        if (!$rating) {
            return response()->json([
                'message' => 'Không tìm thấy đánh giá cho phòng này!'
            ], 404);
        }

        // Cập nhật nội dung đánh giá
        $rating->rating = $request->input('rating');
        $rating->content = $request->input('content');
        $rating->save();

        // Trả về phản hồi thành công
        return response()->json([
            'status' => 'success',
            'message' => 'Cập nhật đánh giá thành công!',
            'rating' => $rating
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $rating = Rating::find($id);
        $rating->delete();
        return response()->json([
            "message" => "Xóa đánh giá thành công!"
        ]);
    }
}
