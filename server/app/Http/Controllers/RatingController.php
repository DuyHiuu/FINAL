<?php

namespace App\Http\Controllers;

use App\Models\Rating;
use Illuminate\Http\Request;

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
    public function store(Request $request, $room_id)
    {
        $request->validate([
            'rating' => 'required|integer|min:1|max:5',
        ]);

        // Kiểm tra xem người dùng đã đánh giá phòng này chưa
        $existingRating = Rating::where('room_id', $room_id)->where('user_id', auth()->id())->first();
        if ($existingRating) {
            // Cập nhật đánh giá nếu người dùng đã đánh giá
            $existingRating->update(['rating' => $request->rating]);
        } else {
            // Tạo mới nếu người dùng chưa đánh giá
            Rating::create([
                'room_id' => $room_id,
                'user_id' => auth()->id(),
                'rating' => $request->rating,
            ]);
        }

        return response()->json(['status' => 'success', 'message' => 'Đánh giá thành công!']);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        // Lấy danh sách đánh giá cho room_id cụ thể, cùng với thông tin người dùng
        $ratings = Rating::where('room_id', $id)->with('user')->get();

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
        //
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