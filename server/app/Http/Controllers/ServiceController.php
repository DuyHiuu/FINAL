<?php

namespace App\Http\Controllers;

use App\Http\Resources\ServiceResource;
use App\Models\Service;
use App\Http\Requests\StoreServiceRequest;
use App\Http\Requests\UpdateServiceRequest;
use CloudinaryLabs\CloudinaryLaravel\Facades\Cloudinary;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator as FacadesValidator;

class ServiceController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $service = Service::all();

        return response()->json($service);
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
        $validator = FacadesValidator::make(
            $request->all(),
            [
                'name' => 'required|max:255',
                'description' => 'required|max:255',
                'price' => 'required|numeric|min:0',
            ],
            [
                'name.required' => 'Tên dịch vụ không được để trống',
                'name.max' => 'Tên dịch vụ không được vượt 255 kí tự',
                'description.required' => 'Mô tả không được để trống',
                'description.max' => 'Mô tả không vượt quá 255 kí tự',
                'price.required' => 'Giá dịch vụ không được để trống',
                'price.numeric' => 'Giá dịch vụ phải là số',
                'price.min' => 'Giá dịch vụ phải lớn hơn 0 hoặc bằng 0',
            ]
        );

        if ($validator->fails()) {
            return response()->json(['status' => 'error', 'message' => $validator->messages()], 400);
        }

        try {
            if ($request->hasFile('image')) {
                $filepath = $request->file('image')->store('uploads/services', 'public');
                $fileUrl = Storage::url($filepath);
            } else {
                $fileUrl = null;
            }

            $name = $request->get('name');
            $description = $request->get('description');
            $price = $request->get('price');

            $data = [
                'name' => $name,
                'image' => $fileUrl,
                'description' => $description,
                'price' => $price,
            ];

            Service::create($data);

            return response()->json(['status' => 'success', 'message' => 'Dịch vụ đã được thêm thành công', 'data' => $data], 200);
        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $service = Service::find($id);
        if ($service) {
            return response()->json($service);
        } else {
            return response()->json(['message' => 'Không tồn tại'], 404);
        }
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Service $service)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, String $id)
    {
        $service = Service::find($id);
        $param = $request->all();
        $validator = FacadesValidator::make(
            $request->all(),
            [
                'name' => 'required|max:255',
                'description' => 'required|max:255',
                'price' => 'required|numeric|min:0',
            ],
            [
                'name.required' => 'Tên dịch vụ không được để trống',
                'name.max' => 'Tên dịch vụ không được vượt 255 kí tự',
                'description.required' => 'Mô tả không được để trống',
                'description.max' => 'Mô tả không vượt quá 255 kí tự',
                'price.required' => 'Giá dịch vụ không được để trống',
                'price.numeric' => 'Giá dịch vụ phải là số',
                'price.min' => 'Giá dịch vụ phải lớn hơn 0 hoặc bằng 0',
            ]
        );

        if ($validator->fails()) {
            return response()->json(['status' => 'error', 'message' => $validator->messages()], 400);
        }

        $service->update($request->except('image'));

        if ($request->image && !str_starts_with($request->image, 'http')) {
            try {
                // Decode base64 nếu không có tiền tố "data:image/..."
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
    
                // Cập nhật đường dẫn ảnh mới
                $service->image = $response;
    
                // Lưu lại room
                $service->save();
            } catch (\Exception $e) {
                return response()->json(['message' => 'Lỗi khi cập nhật ảnh', 'error' => $e->getMessage()], 500);
            }
        } elseif ($request->image) {
            // Nếu chỉ là URL ảnh đã có sẵn, không cần upload lại
            $service->image = $request->image;
            $service->save();
        }

        return response()->json([
            'message' => 'Cập nhập thành công'
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(String $id)
    {
        $service = Service::find($id);
        $service->delete();
        if ($service->image && Storage::disk('public')->exists($service->image)) {
            Storage::disk('public')->delete($service->image);
        }
        return response()->json([
            "message" => "Xóa thành công",
        ]);
    }
}
