<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Models\Room;
use App\Http\Requests\StoreRoomRequest;
use App\Http\Requests\UpdateRoomRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
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
                'sizes.id as size_id'
            )
            ->orderBy('rooms.id', 'desc')
            ->whereNull('rooms.deleted_at')
            ->get();
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
                'price'       => "required",
                'description' => "required",
                'quantity'    => 'required',
                'statusroom'  => "required",
                'size_id'     => "required",
                'img_thumbnail.*'  => "required|image|mimes:jpeg,png,jpg,webp,gif|max:2048",
                'img_sub_images.*' => "nullable|image|mimes:jpeg,png,jpg,webp,gif|max:2048",
            ],
            [
                'img_thumbnail.*.required' => 'Hình ảnh không được để trống!',
                'img_thumbnail.*.image'    => 'Ảnh chính phải là hình ảnh hợp lệ',
                'img_thumbnail.*.mimes'    => 'Hình ảnh phải là một trong các định dạng: jpeg, png, jpg, webp, gif.',
                'img_thumbnail.*.max'      => 'Hình ảnh không được vượt quá 2MB.',

                'img_sub_images.*.image' => 'Các ảnh phụ phải là hình ảnh hợp lệ.',
                'img_sub_images.*.mimes' => 'Hình ảnh phải là một trong các định dạng: jpeg, png, jpg, webp, gif.',
                'img_sub_images.*.max'   => 'Hình ảnh không được vượt quá 2MB.'
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

            $thumbnailPath = null;
            if ($request->hasFile('img_thumbnail')) {
                $image = $request->file('img_thumbnail');
                $thumbnailPath = Cloudinary::upload($image->getRealPath())->getSecurePath();
            }

            $room = Room::create([
                'price' => $price,
                'description' => $description,
                'quantity' => $quantity,
                'statusroom' => $status_room,
                'size_id' => $size_id,
                'img_thumbnail' => $thumbnailPath,
            ]);

            if ($request->hasFile('img_sub_images')) {
                foreach ($request->file('img_sub_images') as $image) {
                    $imagePath = Cloudinary::upload($image->getRealPath())->getSecurePath();
                    $room->roomImages()->create(['image' => $imagePath]);
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
        $room = Room::with('roomImages')
            ->join('sizes', 'rooms.size_id', '=', 'sizes.id')
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
     */ public function update(Request $request, string $id)
    {
        $room = Room::find($id);
        if (!$room) {
            return response()->json(['message' => 'Room không tồn tại'], 400);
        }

        $room->update($request->except('img_thumbnail', 'img_sub_images'));

        if ($request->img_thumbnail && !str_starts_with($request->img_thumbnail, 'http')) {
            try {
                $base64Image = $request->img_thumbnail;
                if (str_contains($base64Image, ',')) {
                    $base64Image = explode(',', $base64Image)[1];
                }
                $image = base64_decode($base64Image);

                $tmpFilePath = sys_get_temp_dir() . '/' . uniqid() . '.png';
                file_put_contents($tmpFilePath, $image);

                $response = Cloudinary::upload($tmpFilePath)->getSecurePath();

                $room->img_thumbnail = $response;

                $room->save();
            } catch (\Exception $e) {
                return response()->json(['message' => 'Lỗi khi cập nhật ảnh', 'error' => $e->getMessage()], 500);
            }
        } elseif ($request->img_thumbnail) {
            $room->img_thumbnail = $request->img_thumbnail;
            $room->save();
        }

        if ($request->hasFile('img_sub_images')) {

            $room->roomImages->each(function ($image) {
                Cloudinary::destroy(basename($image->image));
                $image->delete();
            });

            foreach ($request->file('img_sub_images') as $image) {
                $imagePath = Cloudinary::upload($image->getRealPath())->getSecurePath();
                $room->roomImages()->create(['image' => $imagePath]);
            }
        }

        $room->load('roomImages');
        return response()->json(['message' => 'Cập nhật thành công', 'data' => $room], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $room = Room::find($id);
        $room->delete();
        return response()->json([
            "message" => "delete successfully"
        ]);
    }
    public function getBookedRooms(Request $request)
    {
        $currentDate = Carbon::now()->toDateString();


        $bookedRoomsQuery = Booking::join('payments', 'payments.booking_id', '=', 'bookings.id')
            ->whereIn('status_id', [4, 2, 5])
            ->whereNull('payments.deleted_at')
            ->whereDate('bookings.start_date', '<=', $currentDate)
            ->whereDate('bookings.end_date', '>=', $currentDate)
            ->select('bookings.room_id', DB::raw('COUNT(bookings.room_id) as booked_quantity'))
            ->groupBy('bookings.room_id');

        $bookedRooms = $bookedRoomsQuery->pluck('booked_quantity', 'bookings.room_id');


        $roomsQuery = Room::join('sizes', 'rooms.size_id', '=', 'sizes.id')
        ->select(
            'rooms.id', 'rooms.quantity','rooms.price','rooms.img_thumbnail',
            'sizes.name as size_name',
            'sizes.description as size_description',
            'sizes.id as size_id'
        );

        $rooms = $roomsQuery->get()->map(function ($room) use ($bookedRooms) {
            $bookedQuantity = $bookedRooms[$room->id] ?? 0;
            $room->booked_quantity = $bookedQuantity;
            return $room;
        });

        return response()->json($rooms);
    }
}
