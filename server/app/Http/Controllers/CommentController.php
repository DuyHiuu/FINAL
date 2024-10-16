<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use App\Http\Requests\StoreCommentRequest;
use App\Http\Requests\UpdateCommentRequest;
use App\Models\Room;
use App\Models\Service;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class CommentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $comment = Comment::all();

        return response()->json([
            'status' => true,
            'message' => 'Lấy danh sách thành công',
            'data' => $comment
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
    public function store(Request $request)
    {
        // Xác thực dữ liệu
        $validator = Validator::make($request->all(), [
            'content' => 'required|string|max:1000',
        ]);

        // Nếu xác thực thất bại, trả về lỗi
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        if ($request->isMethod('POST')) {
            DB::beginTransaction(); // Bắt đầu transaction để đảm bảo tính toàn vẹn dữ liệu

            try {
                $params = $request->all();
                $user = User::find($params['user_id']);

                // Tạo mới một comment
                $comment = new Comment();
                $comment->content = $params['content'];
                $comment->user_id = $user->id;

                // Kiểm tra và gán room_id nếu có
                if (!empty($params['room_id'])) {
                    $room = Room::find($params['room_id']);
                    if ($room) {
                        $comment->room_id = $room->id;
                    }
                }

                // Lưu comment vào cơ sở dữ liệu
                $comment->save();

                DB::commit(); // Hoàn thành transaction

                return response()->json([
                    'status' => 'Thành công',
                    'message' => 'Comment đã được lưu thành công',
                    'comment' => $comment
                ], 201);
            } catch (\Exception $e) {
                DB::rollBack(); // Rollback nếu có lỗi
                return response()->json([
                    'status' => 'error',
                    'message' => 'Xảy ra lỗi trong quá trình lưu comment. Vui lòng thử lại!',
                    'error' => $e->getMessage()
                ], 500);
            }
        }
    }

    /**
     * Display the specified resource.
     */
    public function show($room_id)
    {
        // Lấy tất cả các bình luận cho Room cụ thể
        $comments = Comment::where('room_id', $room_id)->with('user')->get();

        // Trả về JSON với các bình luận của room đó
        // return response()->json([
        //     'status' => 'success',
        //     'comments' => $comments
        // ], 200);

        // Kiểm tra nếu tìm thấy bình luận
        if ($comments->isEmpty()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Không tìm thấy bình luận cho phòng này!',
            ], 404);
        }

        // Nếu có bình luận, trả về dữ liệu
        return response()->json([
            'status' => 'success',
            'comments' => $comments
        ], 200);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Comment $comment)
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
            'content' => 'required|string|max:1000',
        ]);

        // Nếu xác thực thất bại, trả về lỗi
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Tìm bình luận dựa trên ID
        $comment = Comment::find($id);

        // Kiểm tra nếu bình luận không tồn tại
        if (!$comment) {
            return response()->json([
                'message' => 'Không tìm thấy bình luận!'
            ], 404);
        }

        // Cập nhật nội dung bình luận
        $comment->content = $request->input('content');
        $comment->save();

        // Trả về phản hồi thành công
        return response()->json([
            'status' => 'success',
            'message' => 'Cập nhật bình luận thành công!',
            'comment' => $comment
        ], 200);
    }


    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        // Tìm Payment theo id
        $comment = Comment::findOrFail($id);

        // Xóa mềm (soft delete)
        $comment->delete();

        return response()->json(['message' => 'Comment đã xóa thành công.']);
    }
}
