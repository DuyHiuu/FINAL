<?php

namespace App\Http\Controllers;

use App\Http\Resources\BlogResource;
use App\Models\Blog;
use App\Http\Requests\StoreBlogRequest;
use App\Http\Requests\UpdateBlogRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class BlogController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $blog = Blog::join('users','blogs.user_id','=','users.id')
        ->select('blogs.*','users.name')
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
        // Validate the incoming request
        $validator = Validator::make(
            $request->all(),[
            'title' => "required",
            'description' => "required",
            'content' => "required",
            'user_id' => "required",
            'image' => "required|image|mimes:jpeg,png,jpg,gif|max:2048",
        ],[
                'title.required' => "title không được để trống",
                'description.required' => "Mô tả không được để trống",
                'content.required' => "content không được để trống",
                'user_id.required' => "Tác giả không được để trống",
                'image.required' => "Hình ảnh không được để trống",
                'image.image' => "Tập tin không phải là hình ảnh",
                'image.mimes' => "Hình ảnh phải là một trong các định dạng: jpeg, png, jpg, gif.",
                'image.max' => "Hình ảnh không được vượt quá 2MB.",
            ]
        );

        if ($validator->fails()) {
            return response()->json(['status'=>'error','message'=>$validator->messages()], 400);
        }

        try {
            // Lấy tệp tin hình ảnh từ request
            $image = $request->file('image');

            // Tạo một tên tệp tin duy nhất
            $uniqueFileName = uniqid('file_') . '.' . $image->getClientOriginalExtension();

            // Lưu tệp tin vào thư mục storage
            $filePath = $image->storeAs('images', $uniqueFileName, 'public'); // Lưu vào thư mục 'images' trong 'storage/app/public'

            // Upload lên Cloudinary
//            $response = cloudinary()->upload(public_path('storage/' . $filePath))->getSecurePath();

            $fullPath = asset('storage/' . $filePath);


            $title = $request->get('title');
            $description = $request->get('description');
            $content = $request->get('content');
            $user_id = $request->get('user_id');

            $data = [
                'image' => $fullPath,
                'title' => $title,
                'description' => $description,
                'content' => $content,
                'user_id' => $user_id,
            ];

            Blog::create($data);

            return response()->json(['status'=>'success','message'=>'Blog đã được thêm thành công','data'=>$data], 200);
        } catch (\Exception $e) {
            return response()->json(['status'=>'error','message'=>$e->getMessage()], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
        $blog = Blog::join('users','blogs.user_id','=','users.id')
            ->select('blogs.*','users.name')
            ->where('blogs.id',$id)
            ->whereNull('blogs.deleted_at')
            ->first()    ;


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
        if(!$blog){
            return response()->json(['message'=>'Blog không tồn tại'], 400);
        }
        if (!$request->filled('title') || !$request->filled('description') || !$request->filled('content') || !$request->filled('user_id')) {
            return response()->json(['message' => 'Các trường bắt buộc không được để trống'], 400);
        }

        // Cập nhật các trường title, description, content, user_id
        $blog->title = $request->title ?? $blog->title;
        $blog->description = $request->description ?? $blog->description;
        $blog->content = $request->content ?? $blog->content;
        $blog->user_id = $request->user_id ?? $blog->user_id;

        // Kiểm tra và cập nhật trường image
        if($request->file('image')){
            $image = $request->file('image');
            $uniqueFileName = uniqid('file_') . '.' . $image->getClientOriginalExtension();
            $filePath = $image->storeAs('images', $uniqueFileName, 'public');
            $fullPath = asset('storage/' . $filePath);

            $blog->image = $fullPath;
        } else {
            // Nếu không có file image mới, giữ nguyên image cũ
            $blog->image = $request->image ?? $blog->image;
        }

        // Lưu lại blog đã cập nhật
        $blog->save();


        return response()->json(['message'=>'Cập nhật thành công'], 200);
    }


    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
        $blog=Blog::find($id);
        $blog->delete();
        return response()->json([
            "message" => "delete successfully"
        ]);
    }
}
