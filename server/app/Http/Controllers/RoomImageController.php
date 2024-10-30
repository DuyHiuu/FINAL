<?php

namespace App\Http\Controllers;

use App\Models\Room_Image;
use CloudinaryLabs\CloudinaryLaravel\Facades\Cloudinary;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

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
            'message' => 'Images uploaded successfully.',
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
        // Xác thực đầu vào
        $request->validate([
            'room_id' => 'required|exists:rooms,id',
            'images' => 'required',
            'images.*' => 'image|mimes:jpeg,png,jpg,gif,svg|max:2048'
        ]);

        // Kiểm tra xem có ảnh nào được tải lên không
        if (!$request->hasFile('images')) {
            return response()->json([
                'success' => false,
                'message' => 'No images were uploaded.',
            ], 400);
        }

        // Kiểm tra số lượng ảnh hiện có trong room_images với room_id này
        $existingImagesCount = Room_Image::where('room_id', $request->room_id)->count();
        $newImagesCount = count($request->file('images'));

        if ($existingImagesCount + $newImagesCount > 4) {
            return response()->json([
                'success' => false,
                'message' => 'You can only upload a maximum of 4 images per room.',
            ], 400);
        }

        $images = [];

        // Lặp qua từng ảnh và tải lên Cloudinary
        foreach ($request->file('images') as $imageFile) {
            try {
                // Tải ảnh lên Cloudinary và lấy đường dẫn URL an toàn
                $response = Cloudinary::upload($imageFile->getRealPath())->getSecurePath();

                // Tạo bản ghi trong bảng Room_Image với đường dẫn Cloudinary
                $roomImage = Room_Image::create([
                    'image' => $response,
                    'room_id' => $request->room_id,
                ]);

                // Định dạng dữ liệu ảnh để trả về
                $images[] = [
                    'id' => $roomImage->id,
                    'image' => $roomImage->image,
                    'room_id' => $roomImage->room_id,
                ];
            } catch (\Exception $e) {
                return response()->json([
                    'success' => false,
                    'message' => 'Failed to upload image: ' . $e->getMessage(),
                ], 500);
            }
        }

        // Trả về phản hồi JSON với các ảnh đã tải lên
        return response()->json([
            'success' => true,
            'message' => 'Images uploaded successfully.',
            'data' => $images,
        ]);
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
    public function update(Request $request, $id)
    {
        // Xác thực đầu vào
        $request->validate([
            'room_id' => 'required|exists:rooms,id',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048'
        ]);

        // Tìm bản ghi room_image theo id
        $roomImage = Room_Image::find($id);

        if (!$roomImage) {
            return response()->json([
                'success' => false,
                'message' => 'Image not found.',
            ], 404);
        }

        // Lấy số lượng ảnh hiện có trong room_images với room_id này
        $existingImagesCount = Room_Image::where('room_id', $id)->count();
        $newImagesCount = $request->hasFile('images') ? count($request->file('images')) : 0;

        // Kiểm tra nếu tổng số ảnh sau khi cập nhật vượt quá 4
        if ($existingImagesCount + $newImagesCount > 4) {
            return response()->json([
                'success' => false,
                'message' => 'You can only have a maximum of 4 images per room.',
            ], 400);
        }

        // Cập nhật room_id
        $roomImage->room_id = $request->room_id;

        // Kiểm tra xem có file ảnh mới không
        if ($request->hasFile('image')) {
            try {
                // Xóa ảnh cũ khỏi Cloudinary (nếu có)
                if ($roomImage->image) {
                    Cloudinary::destroy($roomImage->image);
                }

                // Tải ảnh mới lên Cloudinary
                $newImagePath = Cloudinary::upload($request->file('image')->getRealPath())->getSecurePath();
                $roomImage->image = $newImagePath;
            } catch (\Exception $e) {
                return response()->json([
                    'success' => false,
                    'message' => 'Failed to upload image: ' . $e->getMessage(),
                ], 500);
            }
        }

        // Lưu các thay đổi
        $roomImage->save();

        // Trả về phản hồi JSON với dữ liệu đã cập nhật
        return response()->json([
            'success' => true,
            'message' => 'Image updated successfully.',
            'data' => [
                'id' => $roomImage->id,
                'image' => $roomImage->image,
                'room_id' => $roomImage->room_id,
            ],
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(String $id)
    {
        $roomImage = Room_Image::find($id);
        $roomImage->delete();
        return response()->json([
            "message" => "Delete room_images successfully"
        ]);
    }
}
