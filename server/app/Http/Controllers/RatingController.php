<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Models\Rating;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class RatingController extends Controller
{

    public function index()
    {
        $ratings = Rating::with('room')->get();

        return response()->json([
            'success' => true,
            'message' => 'Lấy dữ liệu thành công!',
            'data' => $ratings,
        ]);
    }
    public function getAll()
    {
        $ratings = Rating::with(['room','room.size', 'user'])->get();
        return response()->json([
            'ratings' => $ratings,
        ]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'rating' => 'required|integer|min:1|max:5',
            'content' => 'required|string|max:1000',
            'room_id' => 'required|integer|exists:rooms,id',
            'user_id' => 'required|integer|exists:users,id',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        if ($request->isMethod('POST')) {
            DB::beginTransaction();

            try {
                $params = $request->all();

                if (!isset($params['user_id'])) {
                    return response()->json([
                        'status' => 'error',
                        'message' => 'user_id không tồn tại trong request.'
                    ], 400);
                }

                $user = User::find($params['user_id']);

                if (!$user) {
                    return response()->json([
                        'status' => 'error',
                        'message' => 'Người dùng không hợp lệ.'
                    ], 404);
                }

                $rating = new Rating();
                $rating->rating = $params['rating'];
                $rating->content = $params['content'];
                $rating->room_id = $params['room_id'];
                $rating->user_id = $user->id;

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
                    'message' => 'Xảy ra lỗi trong quá trình lưu đánh giá. Vui lòng thử lại!',
                    'error' => $e->getMessage()
                ], 500);
            }
        }
    }




    public function show(string $id)
    {
        $ratings = Rating::where('room_id', $id)
            ->with('room', 'user')
            ->get();

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
