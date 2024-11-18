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
        $images = Room_Image::with('room')->get();

        return response()->json([
            'success' => true,
            'message' => 'Lấy dữ liệu thành công!',
            'data' => $images,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        // Logic nếu cần thiết
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
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

        $existingImagesCount = Room_Image::where('room_id', $room_id)->count();
        $newImagesCount = count($request->file('images'));

        if ($existingImagesCount + $newImagesCount > 4) {
            return response()->json(['status' => 'error', 'message' => 'Mỗi phòng chỉ có thể chứa tối đa 4 ảnh!'], 400);
        }

        try {
            $uploadedImages = [];

            foreach ($request->file('images') as $image) {
                $response = Cloudinary::upload($image->getRealPath())->getSecurePath();
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
        $images = Room_Image::where('room_id', $id)->get();

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
        // Logic nếu cần thiết
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
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

        $existingImage = Room_Image::find($id);
        if (!$existingImage) {
            return response()->json(['status' => 'error', 'message' => 'Hình ảnh không tồn tại!'], 404);
        }

        $room_id = $existingImage->room_id;
        $existingImagesCount = Room_Image::where('room_id', $room_id)->count();
        $newImagesCount = count($request->file('images'));

        if ($existingImagesCount + $newImagesCount > 4) {
            return response()->json(['status' => 'error', 'message' => 'Mỗi phòng chỉ có thể chứa tối đa 4 ảnh!'], 400);
        }

        try {
            $uploadedImages = [];

            foreach ($request->file('images') as $image) {

                $response = Cloudinary::upload($image->getRealPath())->getSecurePath();

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

        if ($roomImage && Storage::disk('public')->exists($roomImage->image)) {
            Storage::disk('public')->delete($roomImage->image);
        }

        $roomImage->delete();
        return response()->json([
            "message" => "Xóa hình ảnh thành công!"
        ]);
    }
}
