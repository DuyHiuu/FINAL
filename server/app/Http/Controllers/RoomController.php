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
                'sizes.quantity as quantity',
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

    /**
     * Store a newly created resource in storage.
     */
    //    public function store(Request $request)
    //    {
    //        //
    //        $validator = Validator::make(
    //            $request->all(),[
    //                'price'=>"required",
    //
    //            ],[
    //                'price.required'=>"giá không được để trống",
    //
    //            ]
    //        );
    //        if($validator->fails()){
    //            return response()->json(['status'=>'error','message'=>$validator->messages()],400);
    //        }
    //        try{
    //            $fileData =$request->input('image')['fileList'][0]['thumbUrl'];
    //            $elements = explode(',', $fileData);
    //
    //            $elementsAfter = array_slice($elements,1);
    //
    //            $decodedData = base64_decode($elementsAfter[0]);
    //
    //            $uniqueFileName = uniqid('file_');
    //
    //            $filePath = storage_path('app/'.$uniqueFileName);
    //
    //            file_put_contents($filePath,$decodedData);
    //
    //            $response = cloudinary()->upload($filePath)->getSecurePath();
    //
    //            $price =$request->get('price');
    //            $description=$request->get('description');
    //            $status_room=$request->get('statusroom');
    //            $size_id=$request->get('size_id');
    //            $data = [
    //                'image_thumnail'=>$response,
    //                'price'=>$price,
    //                'description'=>$description,
    //                'statusroom'=>$status_room,
    //                'size_id'=>$size_id,
    //            ];
    //
    //            Room::create($data);
    //            return response()->json(['status'=>'success','message'=>'Sản phẩm đã được thêm thành công','data'=>$data],200);
    //        } catch (\Exception $e){
    //            return response()->json(['status'=>'error','message'=>$e->getMessage()],500);
    //        }
    //    }

    public function store(Request $request)
    {

        // Validate the incoming request
        $validator = Validator::make(
            $request->all(),
            [
                'price' => "required",
                'description' => "required",
                'statusroom' => "required",
                'size_id' => "required",
                'img_thumbnail' => "required|image|mimes:jpeg,png,jpg,gif|max:2048",
            ],
            [
                'price.required' => "Giá không được để trống",
                'description.required' => "Mô tả không được để trống",
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
            $status_room = $request->get('statusroom');
            $size_id = $request->get('size_id');

            $data = [
                'img_thumbnail' => $response,
                'price' => $price,
                'description' => $description,
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
            ->select('rooms.*', 'sizes.name as size_name', 'sizes.description as size_description', 'sizes.quantity as quantity')
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
     */
    public function update(Request $request, string $id)
    {
        // Tìm room với ID
        $room = Room::find($id);
        if (!$room) {
            return response()->json(['message' => 'Room không tồn tại'], 400);
        }

        // Cập nhật các trường
        $room->price = $request->price ?? $room->price;
        $room->description = $request->description ?? $room->description;
        $room->statusroom = $request->statusroom ?? $room->statusroom;
        $room->size_id = $request->size_id ?? $room->size_id;

        // Kiểm tra và cập nhật trường image
        if ($request->file('img_thumbnail')) {
            $image = $request->file('img_thumbnail');
            $response = Cloudinary::upload($image->getRealPath())->getSecurePath();

            // Cập nhật đường dẫn ảnh mới
            $room->img_thumbnail = $response;
        }

        // Lưu lại room đã cập nhật
        if ($room->save()) {
            return response()->json(['message' => 'Cập nhật thành công', 'data' => $room->toArray()], 200);
        } else {
            return response()->json(['message' => 'Cập nhật thất bại'], 500);
        }
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
