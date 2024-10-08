<?php

namespace App\Http\Controllers;

use App\Models\Room;
use App\Http\Requests\StoreRoomRequest;
use App\Http\Requests\UpdateRoomRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;


class RoomController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $room = Room::join('sizes','rooms.size_id','=','sizes.id')
            ->select('rooms.*','sizes.name as size_name','sizes.description as size_description',
            'rooms.size_id','sizes.quantity as quantity')
            ->orderBy('rooms.id')
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
            $request->all(),[
            'price' => "required",
            'description' => "required",
            'statusroom' => "required",
            'size_id' => "required",
            'img_thumnail' => "required|image|mimes:jpeg,png,jpg,gif|max:2048",
        ],[
                'price.required' => "Giá không được để trống",
                'description.required' => "Mô tả không được để trống",
                'statusroom.required' => "Trạng thái phòng không được để trống",
                'size_id.required' => "Kích thước không được để trống",
                'image_thumnail.required' => "Hình ảnh không được để trống",
                'image_thumnail.image' => "Tập tin không phải là hình ảnh",
                'image_thumnail.mimes' => "Hình ảnh phải là một trong các định dạng: jpeg, png, jpg, gif.",
                'image_thumnail.max' => "Hình ảnh không được vượt quá 2MB.",
            ]
        );

        if ($validator->fails()) {
            return response()->json(['status'=>'error','message'=>$validator->messages()], 400);
        }

        try {
            // Lấy tệp tin hình ảnh từ request
            $image = $request->file('img_thumnail');

            // Tạo một tên tệp tin duy nhất
            $uniqueFileName = uniqid('file_') . '.' . $image->getClientOriginalExtension();

            // Lưu tệp tin vào thư mục storage
            $filePath = $image->storeAs('images', $uniqueFileName, 'public'); // Lưu vào thư mục 'images' trong 'storage/app/public'

            // Upload lên Cloudinary
//            $response = cloudinary()->upload(public_path('storage/' . $filePath))->getSecurePath();

            $fullPath = asset('storage/' . $filePath);


            $price = $request->get('price');
            $description = $request->get('description');
            $status_room = $request->get('statusroom');
            $size_id = $request->get('size_id');

            $data = [
                'img_thumnail' => $fullPath,
                'price' => $price,
                'description' => $description,
                'statusroom' => $status_room,
                'size_id' => $size_id,
            ];

            Room::create($data);

            return response()->json(['status'=>'success','message'=>'Sản phẩm đã được thêm thành công','data'=>$data], 200);
        } catch (\Exception $e) {
            return response()->json(['status'=>'error','message'=>$e->getMessage()], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $room = Room::join('sizes','rooms.size_id','=','sizes.id')
            ->select('rooms.*','sizes.name as size_name','sizes.description as size_description')
            ->where('rooms.id',$id)
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
        $room = Room::find($id);
        if(!$room){
            response()->json(['message'=>'Phong da ton tai'],400);
        }
        $room->update($request->except('img_thumnail'));

        if($request->$request->file('img_thumnail')){
            $image = $request->file('img_thumnail');
            $uniqueFileName = uniqid('file_') . '.' . $image->getClientOriginalExtension();
            $filePath = $image->storeAs('images', $uniqueFileName, 'public');
            $fullPath = asset('storage/' . $filePath);

            $room->img_thumnail = $fullPath;
            $room->save();
        }
        else{
            $room->img_thumnail = $request->img_thumnail;
        }

        return response()->json(['message'=>'cap nhat thanh cong'],200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
        $room=Room::find($id);
        $room->delete();
        return response()->json([
            "message" => "delete successfully"
        ]);
    }
}
