<?php

namespace App\Http\Controllers;

use App\Http\Resources\BlogResource;
use App\Models\Blog;
use App\Http\Requests\StoreBlogRequest;
use App\Http\Requests\UpdateBlogRequest;
use CloudinaryLabs\CloudinaryLaravel\Facades\Cloudinary;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class BlogController extends Controller
{
    /**
     * Display a listing of the resource.
     */

    // public function __construct()
    // {
    //     $this->middleware('auth')->only(['store', 'update', 'destroy']);
    // }

    public function index()
    {
        $blog = Blog::join('users', 'blogs.user_id', '=', 'users.id')
            ->select('blogs.*', 'users.name')
            ->whereNull('blogs.deleted_at')
            ->get();
        $blog->makeHidden('user_id');

        return response()->json($blog);
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
        $validator = Validator::make(
            $request->all(),
            [
                'title' => "required",
                'description' => "required",
                'content' => "required",
                'image' => "required|image|mimes:jpeg,png,jpg,gif|max:2048",
            ],
            [
                'title.required' => "Tiêu đề không được để trống",
                'description.required' => "Mô tả không được để trống",
                'content.required' => "Nội dung không được để trống",
                'image.required' => "Hình ảnh không được để trống",
                'image.image' => "Tập tin không phải là hình ảnh",
                'image.mimes' => "Hình ảnh phải là một trong các định dạng: jpeg, png, jpg, gif.",
                'image.max' => "Hình ảnh không được vượt quá 2MB.",
            ]
        );

        if ($validator->fails()) {
            return response()->json(['status' => 'error', 'message' => $validator->messages()], 400);
        }

        try {
            // Upload hình ảnh
            $image = $request->file('image');
            $response = Cloudinary::upload($image->getRealPath())->getSecurePath();

            // Lấy thông tin từ request
            $title = $request->get('title');
            $description = $request->get('description');
            $content = $request->get('content');
            $data = [
                'image' => $response,
                'title' => $title,
                'description' => $description,
                'content' => $content,
                'user_id' => 1,
            ];

            Blog::create($data);

            return response()->json(['status' => 'success', 'message' => 'Blog đã được thêm thành công', 'data' => $data], 200);
        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 500);
        }
    }



    // public function store(Request $request)
    // {
    //     // Validate input
    //     $validator = Validator::make($request->all(), [
    //         'title' => 'required|string|max:255',
    //         'description' => 'required|string|max:1000',
    //         'content' => 'required|string',
    //         'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
    //     ]);

    //     if ($validator->fails()) {
    //         return response()->json(['errors' => $validator->errors()], 422);
    //     }

    //     DB::beginTransaction();

    //     try {
    //         // Lấy thông tin từ request
    //         $params = $request->all();

    //         // Xử lý ảnh nếu có
    //         $imgPath = null;
    //         if ($request->hasFile('image')) {
    //             $image = $request->file('image');
    //             $imgPath = Cloudinary::upload($image->getRealPath())->getSecurePath(); // Upload ảnh lên Cloudinary hoặc nơi lưu trữ
    //         }

    //         // Kiểm tra người dùng đã đăng nhập
    //         // $user_id = auth()->id();  // Giữ user_id mặc dù có thể là null

    //         // Lưu bài viết mới vào cơ sở dữ liệu
    //         $blog = new Blog();
    //         $blog->title = $params['title'];
    //         $blog->description = $params['description'];
    //         $blog->content = $params['content'];
    //         $blog->image = $imgPath;
    //         $blog->user_id = $user_id; // Có thể là null nếu không đăng nhập

    //         // Lưu bài viết
    //         $blog->save();

    //         DB::commit();

    //         return response()->json([
    //             'status' => 'success',
    //             'message' => 'Bài viết đã được tạo thành công!',
    //             'data' => $blog,
    //         ], 201);
    //     } catch (\Exception $e) {
    //         DB::rollBack();
    //         return response()->json([
    //             'status' => 'error',
    //             'message' => 'Xảy ra lỗi trong quá trình tạo bài viết. Vui lòng thử lại!',
    //             'error' => $e->getMessage(),
    //         ], 500);
    //     }
    // }





    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
        $blog = Blog::join('users', 'blogs.user_id', '=', 'users.id')
            ->select('blogs.*', 'users.name')
            ->where('blogs.id', $id)
            ->whereNull('blogs.deleted_at')
            ->first();


        if ($blog) {
            return response()->json($blog);
        } else {
            return response()->json(['message' => 'Không tồn tại'], 404);
        }
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Blog $blog)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        // Lấy blog theo ID
        $blog = Blog::find($id);
        if (!$blog) {
            return response()->json(['message' => 'Blog không tồn tại'], 400);
        }

        // Validate dữ liệu yêu cầu
        $validator = Validator::make(
            $request->all(),
            [
                'title' => 'required',
                'description' => 'required',
                'content' => 'required',
            ],
            [
                'title.required' => 'Tiêu đề không được để trống',
                'description.required' => 'Mô tả không được để trống',
                'content.required' => 'Nội dung không được để trống',
            ]
        );

        // Kiểm tra nếu có lỗi validate
        if ($validator->fails()) {
            return response()->json(['status' => 'error', 'message' => $validator->messages()], 400);
        }

        // Cập nhật các trường blog
        $blog->update($request->except('image')); // Cập nhật các trường mà không có ảnh

        // Xử lý ảnh nếu có
        if ($request->image && !str_starts_with($request->image, 'http')) {
            try {
                // Decode base64 nếu không có tiền tố "data:image/... "
                $base64Image = $request->image;
                if (str_contains($base64Image, ',')) {
                    $base64Image = explode(',', $base64Image)[1]; // Loại bỏ tiền tố nếu có
                }
                $image = base64_decode($base64Image);

                // Tạo một file tạm thời từ base64 để upload lên Cloudinary
                $tmpFilePath = sys_get_temp_dir() . '/' . uniqid() . '.png';
                file_put_contents($tmpFilePath, $image);

                // Upload file tạm lên Cloudinary
                $response = Cloudinary::upload($tmpFilePath)->getSecurePath();

                // Cập nhật đường dẫn ảnh thumbnail mới
                $blog->image = $response;

                // Cập nhật thông tin blog
                $blog->save();
            } catch (\Exception $e) {
                return response()->json(['message' => 'Lỗi khi cập nhật ảnh', 'error' => $e->getMessage()], 500);
            }
        } elseif ($request->image) {
            // Nếu chỉ là URL ảnh đã có sẵn, không cần upload lại
            $blog->image = $request->image;
            $blog->save();
        }

        return response()->json(['message' => 'Cập nhật thành công'], 200);
    }



    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
        $blog = Blog::find($id);
        $blog->delete();
        return response()->json([
            "message" => "delete successfully"
        ]);
    }
}
