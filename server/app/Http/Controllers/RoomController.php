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

        // Validate the incoming request
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

        try {
            // Lấy tệp tin hình ảnh từ request
            $image = $request->file('img_thumbnail');

            // Tạo một tên tệp tin duy nhất
            //            $uniqueFileName = uniqid('file_') . '.' . $image->getClientOriginalExtension();

            // Lưu tệp tin vào thư mục storage
            //            $filePath = $image->storeAs('images', $uniqueFileName, 'public'); // Lưu vào thư mục 'images' trong 'storage/app/public'

            //             Upload lên Cloudinary
            $response = Cloudinary::upload($image->getRealPath())->getSecurePath();

            //            $fullPath = asset('storage/' . $filePath);


            $price = $request->get('price');
            $description = $request->get('description');
            $quantity = $request->get('quantity');
            $status_room = $request->get('statusroom');
            $size_id = $request->get('size_id');

            $data = [
                'img_thumbnail' => $response,
                'price' => $price,
                'description' => $description,
                'quantity' => $quantity,
                'statusroom' => $status_room,
                'size_id' => $size_id,
            ];

            Room::create($data);

            return response()->json(['status' => 'success', 'message' => 'Sản phẩm đã được thêm thành công', 'data' => $data], 200);
        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $room = Room::join('sizes', 'rooms.size_id', '=', 'sizes.id')
            ->select('rooms.*', 'sizes.name as size_name', 'sizes.description as size_description')
            ->where('rooms.id', $id)
            ->whereNull('rooms.deleted_at')
            ->first();

        if ($room) {
            return response()->json($room);
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
     */public function update(Request $request, string $id)
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

        // Cập nhật các trường
        $room->update($request->except('img_thumbnail'));

        // Kiểm tra nếu có chuỗi base64 trong `img_thumbnail`
        if ($request->img_thumbnail && !str_starts_with($request->img_thumbnail, 'http')) {
            try {
                // Decode base64 nếu không có tiền tố "data:image/..."
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
