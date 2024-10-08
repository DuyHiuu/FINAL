<?php

namespace App\Http\Controllers;

use App\Models\Size;
use App\Http\Requests\StoreSizeRequest;
use App\Http\Requests\UpdateSizeRequest;
use App\Http\Resources\SizeResource;
use Illuminate\Http\Request;
use Nette\Utils\Strings;

class SizeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $size = Size::all();

        return response()->json([
            'status' => true,
            'message' => 'Lấy danh sách thành công',
            'data' => $size
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
        $size = Size::query()->create([
            'name' => $request->name,
            'quantity'  => $request->quantity,
            'description'  => $request->description
        ]);
        return response()->json(new SizeResource($size), 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $size = Size::find($id);

        if($size){
            return response()->json([
                'status' => true,
                'message' => 'Lấy danh sách thành công',
                'data' => $size
            ]);
        }else{
            return response()->json(['message' => 'Không tồn tại', 404]);
        }
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Size $size)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $size = Size::query()->where('id', $id)->first();
        $size ->update([
            'name' => $request->name,
            'quantity'  => $request->quantity,
            'description'  => $request->description
        ]);
        $arr = [
            'status' => true,
            'message' => 'Cập nhật thông tin thành công',
            '$data' => new SizeResource($size)
        ];
        return response()->json($arr, 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $size = Size::query()->where('id', $id)->first();

        if(!$size){
            $arr = [
                'status' => false,
                'message' => 'Không tìm thấy size cần xóa',
                '$data' => []
            ];
    
        }else{
            $size->delete();
            $arr = [
                'status' => true,
                'message' => 'Xóa thành công',
            ];
        }
        return response()->json($arr, 200);
    }
}
