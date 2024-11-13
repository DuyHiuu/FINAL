<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Models\Rating;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class RatingController extends Controller
{
    public function __construct()
    {
        // Chỉ cho phép người dùng đã đăng nhập truy cập các phương thức này
        $this->middleware('auth:sanctum')->only(['store', 'update', 'destroy']);
    }

    public function index()
    {
        $ratings = Rating::with('room')->get();

        return response()->json([
            'success' => true,
            'message' => 'Lấy dữ liệu thành công!',
            'data' => $ratings,
        ]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'rating' => 'required|integer|min:1|max:5',
            'content' => 'required|string|max:1000',
            'room_id' => 'required|integer|exists:rooms,id',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user = auth()->user();

        $hasCompletedBooking = Booking::where('room_id', $request->room_id)
            ->where('user_id', $user->id)
            ->where('status', 'completed')
            ->exists();

        if (!$hasCompletedBooking) {
            return response()->json([
                'status' => 'error',
                'message' => 'Bạn chỉ có thể đánh giá sau khi hoàn tất đặt phòng và thanh toán!'
            ], 403);
        }

        DB::beginTransaction();

        try {
            $rating = new Rating();
            $rating->rating = $request->rating;
            $rating->content = $request->content;
            $rating->user_id = $user->id;
            $rating->room_id = $request->room_id;
            $rating->save();

            DB::commit();

            return response()->json([
                'status' => 'success',
                'message' => 'Đánh giá đã được lưu thành công!',
                'rating' => $rating
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'status' => 'error',
                'message' => 'Xảy ra lỗi trong quá trình đánh giá. Vui lòng thử lại!',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function show(string $id)
    {
        $ratings = Rating::where('room_id', $id)->with('room')->get();

        if ($ratings->isEmpty()) {
            return response()->json([
                'success' => false,
                'message' => 'Không có đánh giá nào cho phòng này!',
                'data' => [],
            ]);
        }

        return response()->json([
            'success' => true,
            'message' => 'Lấy dữ liệu thành công!',
            'data' => $ratings,
        ]);
    }

    public function update(Request $request, string $id)
    {
        $validator = Validator::make($request->all(), [
            'rating' => 'required|integer|min:1|max:5',
            'content' => 'required|string|max:1000',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $rating = Rating::find($id);

        if (!$rating) {
            return response()->json([
                'message' => 'Không tìm thấy đánh giá cho phòng này!'
            ], 404);
        }

        $rating->rating = $request->input('rating');
        $rating->content = $request->input('content');
        $rating->save();

        return response()->json([
            'status' => 'success',
            'message' => 'Cập nhật đánh giá thành công!',
            'rating' => $rating
        ], 200);
    }

    public function destroy(string $id)
    {
        $rating = Rating::find($id);

        if (!$rating) {
            return response()->json(['message' => 'Đánh giá không tồn tại!'], 404);
        }

        $rating->delete();

        return response()->json([
            'message' => 'Xóa đánh giá thành công!'
        ]);
    }
}
