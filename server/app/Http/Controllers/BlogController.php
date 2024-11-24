<?php

namespace App\Http\Controllers;

use App\Models\Blog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use CloudinaryLabs\CloudinaryLaravel\Facades\Cloudinary;

class BlogController extends Controller
{
    /**
     * Hiển thị danh sách các blog.
     */
    public function index()
    {
        $blogs = Blog::select('id', 'title', 'description', 'content', 'image', 'created_at')
            ->whereNull('deleted_at')
            ->get();

        return response()->json($blogs, 200);
    }

    /**
     * Thêm blog mới.
     */
    public function store(Request $request)
    {
        $validator = Validator::make(
            $request->all(),
            [
                'title' => 'required|string|max:255',
                'description' => 'required|string|max:1000',
                'content' => 'required|string',
                'image' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
            ],
            [
                'title.required' => 'Tiêu đề không được để trống',
                'description.required' => 'Mô tả không được để trống',
                'content.required' => 'Nội dung không được để trống',
                'image.required' => 'Hình ảnh không được để trống',
                'image.image' => 'Tập tin không phải là hình ảnh',
                'image.mimes' => 'Hình ảnh phải có định dạng jpeg, png, jpg hoặc gif',
                'image.max' => 'Hình ảnh không được vượt quá 2MB',
            ]
        );

        if ($validator->fails()) {
            return response()->json(['status' => 'error', 'message' => $validator->messages()], 400);
        }

        try {
            // Upload hình ảnh lên Cloudinary
            $imagePath = Cloudinary::upload($request->file('image')->getRealPath())->getSecurePath();

            // Tạo blog mới
            $blog = Blog::create([
                'title' => $request->input('title'),
                'description' => $request->input('description'),
                'content' => $request->input('content'),
                'image' => $imagePath,
            ]);

            return response()->json(['status' => 'success', 'message' => 'Blog đã được tạo thành công', 'data' => $blog], 201);
        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * Hiển thị thông tin chi tiết của một blog.
     */
    public function show($id)
    {
        $blog = Blog::select('id', 'title', 'description', 'content', 'image', 'created_at')
            ->where('id', $id)
            ->whereNull('deleted_at')
            ->first();

        if (!$blog) {
            return response()->json(['status' => 'error', 'message' => 'Blog không tồn tại'], 404);
        }

        return response()->json($blog, 200);
    }

    /**
     * Cập nhật blog.
     */
    public function update(Request $request, $id)
    {
        $blog = Blog::find($id);

        if (!$blog) {
            return response()->json(['status' => 'error', 'message' => 'Blog không tồn tại'], 404);
        }

        $validator = Validator::make(
            $request->all(),
            [
                'title' => 'required|string|max:255',
                'description' => 'required|string|max:1000',
                'content' => 'required|string',
            ],
            [
                'title.required' => 'Tiêu đề không được để trống',
                'description.required' => 'Mô tả không được để trống',
                'content.required' => 'Nội dung không được để trống',
            ]
        );

        if ($validator->fails()) {
            return response()->json(['status' => 'error', 'message' => $validator->messages()], 400);
        }

        try {
            // Cập nhật các trường blog
            $blog->update($request->except('image'));

            // Xử lý hình ảnh nếu có
            if ($request->hasFile('image')) {
                $imagePath = Cloudinary::upload($request->file('image')->getRealPath())->getSecurePath();
                $blog->update(['image' => $imagePath]);
            }

            return response()->json(['status' => 'success', 'message' => 'Blog đã được cập nhật thành công', 'data' => $blog], 200);
        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * Xóa blog (soft delete).
     */
    public function destroy($id)
    {
        $blog = Blog::find($id);

        if (!$blog) {
            return response()->json(['status' => 'error', 'message' => 'Blog không tồn tại'], 404);
        }

        try {
            $blog->delete();
            return response()->json(['status' => 'success', 'message' => 'Blog đã được xóa thành công'], 200);
        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 500);
        }
    }
}
