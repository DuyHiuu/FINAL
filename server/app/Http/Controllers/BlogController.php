<?php

namespace App\Http\Controllers;

use App\Http\Resources\BlogResource;
use App\Models\Blog;
use App\Http\Requests\StoreBlogRequest;
use App\Http\Requests\UpdateBlogRequest;
use CloudinaryLabs\CloudinaryLaravel\Facades\Cloudinary;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class BlogController extends Controller
{
    /**
     * Display a listing of the resource.
     */

    public function __construct()
    {
        $this->middleware('auth')->only(['store', 'update', 'destroy']);
    }

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
    // public function store(Request $request)
    // {
    //     // Validate the incoming request
    //     $validator = Validator::make(
    //         $request->all(),
    //         [
    //             'title' => "required",
    //             'description' => "required",
    //             'content' => "required",
    //             'user_id' => "required",
    //             'image' => "required|image|mimes:jpeg,png,jpg,gif|max:2048",
    //         ],
    //         [
    //             'title.required' => "title không được để trống",
    //             'description.required' => "Mô tả không được để trống",
    //             'content.required' => "content không được để trống",
    //             'user_id.required' => "Tác giả không được để trống",
    //             'image.required' => "Hình ảnh không được để trống",
    //             'image.image' => "Tập tin không phải là hình ảnh",
    //             'image.mimes' => "Hình ảnh phải là một trong các định dạng: jpeg, png, jpg, gif.",
    //             'image.max' => "Hình ảnh không được vượt quá 2MB.",
    //         ]
    //     );

    //     if ($validator->fails()) {
    //         return response()->json(['status' => 'error', 'message' => $validator->messages()], 400);
    //     }

    //     try {
    //         // Lấy tệp tin hình ảnh từ request
    //         $image = $request->file('image');
    //         // Upload lên Cloudinary
    //         $response = Cloudinary::upload($image->getRealPath())->getSecurePath();

    //         $title = $request->get('title');
    //         $description = $request->get('description');
    //         $content = $request->get('content');
    //         $user_id = $request->get('user_id');

    //         $data = [
    //             'image' => $response,
    //             'title' => $title,
    //             'description' => $description,
    //             'content' => $content,
    //             'user_id' => $user_id,
    //         ];

    //         Blog::create($data);

    //         return response()->json(['status' => 'success', 'message' => 'Blog đã được thêm thành công', 'data' => $data], 200);
    //     } catch (\Exception $e) {
    //         return response()->json(['status' => 'error', 'message' => $e->getMessage()], 500);
    //     }
    // }

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
                'title.required' => "Title không được để trống",
                'description.required' => "Mô tả không được để trống",
                'content.required' => "Content không được để trống",
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
            $image = $request->file('image');
            $response = Cloudinary::upload($image->getRealPath())->getSecurePath();

            $blog = Blog::create([
                'image' => $response,
                'title' => $request->get('title'),
                'description' => $request->get('description'),
                'content' => $request->get('content'),
                'user_id' => auth()->id(),
            ]);

            return response()->json(['status' => 'success', 'message' => 'Blog đã được thêm thành công', 'data' => $blog], 200);
        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 500);
        }
    }


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
        $blog = Blog::find($id);
        if (!$blog) {
            return response()->json(['message' => 'Blog không tồn tại'], 400);
        }

        $blog->title = $request->title ?? $blog->title;
        $blog->description = $request->description ?? $blog->description;
        $blog->content = $request->content ?? $blog->content;
        $blog->user_id = $request->user_id ?? $blog->user_id;

        if ($request->image && !str_starts_with($request->image, 'http')) {
            try {
                $base64Image = $request->image;
                if (str_contains($base64Image, ',')) {
                    $base64Image = explode(',', $base64Image)[1];
                }
                $image = base64_decode($base64Image);

                $tmpFilePath = sys_get_temp_dir() . '/' . uniqid() . '.png';
                file_put_contents($tmpFilePath, $image);

                $response = Cloudinary::upload($tmpFilePath)->getSecurePath();

                $blog->image = $response;

                $blog->save();
            } catch (\Exception $e) {
                return response()->json(['message' => 'Lỗi khi cập nhật ảnh', 'error' => $e->getMessage()], 500);
            }
        } elseif ($request->image) {
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
