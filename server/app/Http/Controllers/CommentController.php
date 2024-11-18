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
        $comments = Comment::with('user', 'room')->get();

        return response()->json([
            'status' => true,
            'message' => 'Lấy danh sách thành công',
            'data' => $comments
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
        $validator = Validator::make($request->all(), [
            'content' => 'required|string|max:1000',
            'room_id' => 'required|integer|exists:rooms,id',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        if ($request->isMethod('POST')) {
            DB::beginTransaction();

            try {
                $params = $request->all();
                $user = User::find($params['user_id']);

                if (!$user) {
                    return response()->json([
                        'status' => 'error',
                        'message' => 'Người dùng không hợp lệ.'
                    ], 404);
                }

                $comment = new Comment();
                $comment->content = $params['content'];
                $comment->user_id = $user->id;

                if (!empty($params['room_id'])) {
                    $room = Room::find($params['room_id']);
                    if ($room) {
                        $comment->room_id = $room->id;
                    } else {
                        return response()->json([
                            'status' => 'error',
                            'message' => 'Phòng không tồn tại.'
                        ], 404);
                    }
                }

                $comment->save();

                DB::commit();

                return response()->json([
                    'status' => 'Thành công',
                    'message' => 'Comment đã được lưu thành công',
                    'comment' => $comment
                ], 201);
            } catch (\Exception $e) {
                DB::rollBack();
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
        $comments = Comment::where('room_id', $room_id)->with('user')->get();

        if ($comments->isEmpty()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Không tìm thấy bình luận cho phòng này!',
            ], 404);
        }

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
        $validator = Validator::make($request->all(), [
            'content' => 'required|string|max:1000',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $comment = Comment::find($id);

        if (!$comment) {
            return response()->json([
                'message' => 'Không tìm thấy bình luận!'
            ], 404);
        }

        $comment->content = $request->input('content');
        $comment->save();

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
        $comment = Comment::findOrFail($id);
        $comment->delete();
        return response()->json(['message' => 'Comment đã xóa thành công.']);
    }
}
