<?php

namespace App\Http\Controllers;

use App\Models\Room_Image;
use CloudinaryLabs\CloudinaryLaravel\Facades\Cloudinary;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class RoomImageController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $images = Room_Image::with('room')->get(); // lấy tất cả room_images cùng với thông tin rooms

        return response()->json([
            'success' => true,
            'message' => 'Lấy dữ liệu thành công!.',
            'data' => $images,
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
        // Validate the incoming request
        $validator = Validator::make(
            $request->all(),
            [
                'room_id' => 'required|exists:rooms,id',
                'images.*' => 'required|image|mimes:jpeg,png,jpg,webp,gif,svg|max:2048',
            ],
            [
                'room_id.required' => "Room không được để trống!",
                'images.*.required' => "Hình ảnh không được để trống!",
                'images.*.image' => "Tập tin không phải là hình ảnh!",
                'images.*.mimes' => "Hình ảnh phải là một trong các định dạng: jpeg, png, jpg, gif.",
                'images.*.max' => "Hình ảnh không được vượt quá 2MB.",
            ]
        );

        if ($validator->fails()) {
            return response()->json(['status' => 'error', 'message' => $validator->messages()], 400);
        }

        $room_id = $request->get('room_id');

        // Kiểm tra số lượng hình ảnh hiện có của phòng này
        $existingImagesCount = Room_Image::where('room_id', $room_id)->count();
        $newImagesCount = count($request->file('images'));

        if ($existingImagesCount + $newImagesCount > 4) {
            return response()->json(['status' => 'error', 'message' => 'Mỗi phòng chỉ có thể chứa tối đa 4 ảnh!.'], 400);
        }

        try {
            $uploadedImages = [];

            foreach ($request->file('images') as $image) {
                // Tải từng hình ảnh lên Cloudinary
                $response = Cloudinary::upload($image->getRealPath())->getSecurePath();

                // Tạo bản ghi cho mỗi hình ảnh được tải lên
                $data = [
                    'image' => $response,
                    'room_id' => $room_id,
                ];

                Room_Image::create($data);
                $uploadedImages[] = $data;
            }

            return response()->json(['status' => 'success', 'message' => 'Room_images đã được thêm thành công!', 'data' => $uploadedImages], 200);
        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        // Lấy tất cả các ảnh từ room_imges với room_id cụ thể
        $images = Room_Image::where('room_id', $id)->get();

        // Định dạng dữ liệu ảnh để trả về JSON
        $imageData = $images->map(function ($image) {
            return [
                'id' => $image->id,
                'image_url' => asset('storage/' . $image->image),
                'room_id' => $image->room_id,
            ];
        });

        if ($imageData->isEmpty()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Không tìm thấy ảnh cho phòng này!',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $imageData,
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
        // Validate the incoming request
        $validator = Validator::make(
            $request->all(),
            [
                'images.*' => 'required|image|mimes:jpeg,png,jpg,webp,gif,svg|max:2048',
            ],
            [
                'images.*.required' => "Hình ảnh không được để trống!",
                'images.*.image' => "Tập tin không phải là hình ảnh!",
                'images.*.mimes' => "Hình ảnh phải là một trong các định dạng: jpeg, png, jpg, gif.",
                'images.*.max' => "Hình ảnh không được vượt quá 2MB.",
            ]
        );

        if ($validator->fails()) {
            return response()->json(['status' => 'error', 'message' => $validator->messages()], 400);
        }

        // Kiểm tra xem hình ảnh có tồn tại không
        $existingImage = Room_Image::find($id);
        if (!$existingImage) {
            return response()->json(['status' => 'error', 'message' => 'Hình ảnh không tồn tại!.'], 404);
        }

        // Kiểm tra tổng số hình ảnh của phòng
        $room_id = $existingImage->room_id;
        $existingImagesCount = Room_Image::where('room_id', $room_id)->count();
        $newImagesCount = count($request->file('images'));

        // Đảm bảo tổng số hình ảnh sau khi cập nhật không vượt quá 4
        if ($existingImagesCount + $newImagesCount > 4) {
            return response()->json(['status' => 'error', 'message' => 'Mỗi phòng chỉ có thể chứa tối đa 4 ảnh!.'], 400);
        }

        try {
            $uploadedImages = [];

            // Cập nhật hình ảnh mới hoặc thay thế hình ảnh hiện có
            foreach ($request->file('images') as $image) {
                // Tải hình ảnh mới lên Cloudinary
                $response = Cloudinary::upload($image->getRealPath())->getSecurePath();

                // Cập nhật dữ liệu hình ảnh
                $existingImage->update(['image' => $response]);

                $uploadedImages[] = ['image' => $response, 'room_id' => $room_id];
            }

            return response()->json(['status' => 'success', 'message' => 'Room_Images đã được cập nhật thành công!', 'data' => $uploadedImages], 200);
        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(String $id)
    {
        $roomImage = Room_Image::find($id);
        $roomImage->delete();
        return response()->json([
            "message" => "Xóa hình ảnh thành công!"
        ]);
    }
}
