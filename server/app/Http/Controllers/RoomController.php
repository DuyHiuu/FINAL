<?php

namespace App\Http\Controllers;

use App\Models\Room;
use App\Http\Requests\StoreRoomRequest;
use App\Http\Requests\UpdateRoomRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;
use CloudinaryLabs\CloudinaryLaravel\Facades\Cloudinary;

class RoomController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {


        $room = Room::join('sizes', 'rooms.size_id', '=', 'sizes.id')

            ->select(
                'rooms.*',
                'sizes.name as size_name',
                'sizes.description as size_description',
                'rooms.size_id'
            )
            ->orderBy('rooms.id', 'desc')
            ->whereNull('rooms.deleted_at')
            ->get();
        $room->makeHidden(['size_id']);
        return response()->json($room);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    public function store(Request $request)
    {
        $validator = Validator::make(
            $request->all(),
            [
                'price' => "required",
                'description' => "required",
                'quantity' => 'required',
                'statusroom' => "required",
                'size_id' => "required",
                'img_thumbnail.*' => "required|image|mimes:jpeg,png,jpg,gif|max:2048",
                'img_sub_images.*' => "nullable|image|mimes:jpeg,png,jpg,gif|max:2048", // Dành cho ảnh phụ
            ],
            [
                'img_sub_images.*.image' => 'Các ảnh phụ phải là hình ảnh hợp lệ.',
            ]
        );

        if ($validator->fails()) {
            return response()->json(['status' => 'error', 'message' => $validator->messages()], 400);
        }

        try {
            $price = $request->get('price');
            $description = $request->get('description');
            $quantity = $request->get('quantity');
            $status_room = $request->get('statusroom');
            $size_id = $request->get('size_id');

            // Xử lý ảnh thumbnail chính
            $thumbnailPath = null;
            if ($request->hasFile('img_thumbnail')) {
                $image = $request->file('img_thumbnail');
                $thumbnailPath = Cloudinary::upload($image->getRealPath())->getSecurePath();
            }

            // Lưu phòng mới vào cơ sở dữ liệu
            $room = Room::create([
                'price' => $price,
                'description' => $description,
                'quantity' => $quantity,
                'statusroom' => $status_room,
                'size_id' => $size_id,
                'img_thumbnail' => $thumbnailPath,
            ]);

            // Lưu ảnh phụ vào bảng room_images
            if ($request->hasFile('img_sub_images')) {
                foreach ($request->file('img_sub_images') as $image) {
                    $imagePath = Cloudinary::upload($image->getRealPath())->getSecurePath();
                    $room->roomImages()->create(['image' => $imagePath]); // Chỉnh sửa trường 'image' thay vì 'path'
                }
            }

            return response()->json(['status' => 'success', 'message' => 'Sản phẩm đã được thêm thành công', 'data' => $room], 200);
        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 500);
        }
    }



    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $room = Room::with('roomImages') // Sử dụng eager loading để lấy ảnh phụ
            ->join('sizes', 'rooms.size_id', '=', 'sizes.id')
            ->select('rooms.*', 'sizes.name as size_name', 'sizes.description as size_description')
            ->where('rooms.id', $id)
            ->whereNull('rooms.deleted_at')
            ->first();

        if ($room) {
            return response()->json($room); // Trả về phòng kèm theo ảnh phụ
        } else {
            return response()->json(['message' => 'Không tồn tại'], 404);
        }
    }


    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Room $room)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */ public function update(Request $request, string $id)
    {
        // Tìm room với ID
        $room = Room::find($id);
        $validator = Validator::make(
            $request->all(),
            [
                'price' => "required",
                'description' => "required",
                'quantity' => 'required',
                'statusroom' => "required",
                'size_id' => "required",
                'img_thumbnail' => "required|image|mimes:jpeg,png,jpg,gif|max:2048",
            ],
            [
                'price.required' => "Giá không được để trống",
                'description.required' => "Mô tả không được để trống",
                'quantity.required' => "Không được để trống",
                'statusroom.required' => "Trạng thái phòng không được để trống",
                'size_id.required' => "Kích thước không được để trống",
                'img_thumbnail.required' => "Hình ảnh không được để trống",
                'img_thumbnail.image' => "Tập tin không phải là hình ảnh",
                'img_thumbnail.mimes' => "Hình ảnh phải là một trong các định dạng: jpeg, png, jpg, gif.",
                'img_thumbnail.max' => "Hình ảnh không được vượt quá 2MB.",
            ]
        );

        if ($validator->fails()) {
            return response()->json(['status' => 'error', 'message' => $validator->messages()], 400);
        }
        if (!$room) {
            return response()->json(['message' => 'Room không tồn tại'], 400);
        }


        // Cập nhật các trường khác
        $room->update($request->except('img_thumbnail', 'img_sub_images'));

        // Cập nhật các trường
        $room->update($request->except('img_thumbnail'));


        // Kiểm tra nếu có chuỗi base64 trong `img_thumbnail`
        if ($request->img_thumbnail && !str_starts_with($request->img_thumbnail, 'http')) {
            try {
                // Decode base64 nếu không có tiền tố "data:image/... "
                $base64Image = $request->img_thumbnail;
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
                $room->img_thumbnail = $response;

                // Cập nhật thông tin phòng

                // Cập nhật đường dẫn ảnh mới
                $room->img_thumbnail = $response;

                // Lưu lại room

                $room->save();
            } catch (\Exception $e) {
                return response()->json(['message' => 'Lỗi khi cập nhật ảnh', 'error' => $e->getMessage()], 500);
            }
        } elseif ($request->img_thumbnail) {
            // Nếu chỉ là URL ảnh đã có sẵn, không cần upload lại
            $room->img_thumbnail = $request->img_thumbnail;
            $room->save();
        }


        // Cập nhật ảnh phụ nếu có
        if ($request->hasFile('img_sub_images')) {
            // Xóa ảnh phụ cũ (nếu cần)
            $room->roomImages->each(function ($image) {
                // Xóa ảnh cũ từ Cloudinary
                Cloudinary::destroy(basename($image->image)); // Sử dụng 'image' thay vì 'path'
                $image->delete();
            });

            // Lưu ảnh phụ mới
            foreach ($request->file('img_sub_images') as $image) {
                $imagePath = Cloudinary::upload($image->getRealPath())->getSecurePath();
                $room->roomImages()->create(['image' => $imagePath]); // Chỉnh sửa trường 'image' thay vì 'path'
            }
        }

        // Trả về thông tin phòng đã cập nhật, bao gồm ảnh phụ
        $room->load('roomImages'); // Tải ảnh phụ đã lưu
        return response()->json(['message' => 'Cập nhật thành công', 'data' => $room], 200);

        return response()->json(['message' => 'Cập nhật thành công', 'data' => $room->toArray()], 200);

    }




    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
        $room = Room::find($id);
        $room->delete();
        return response()->json([
            "message" => "delete successfully"
        ]);
    }
}
