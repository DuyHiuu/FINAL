<?php

namespace App\Http\Controllers;

use App\Models\Size;
use App\Http\Requests\StoreSizeRequest;
use App\Http\Requests\UpdateSizeRequest;
use App\Http\Resources\SizeResource;
use Illuminate\Http\Request;

class SizeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $sizes = Size::all();

        $sizeArray = $sizes->toArray();

        return response()->json([
            'status' => true,
            'message' => 'Lấy danh sách thành công',
            'data' => $sizeArray
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $size = Size::create([
            'name' => $request->name,
            'description' => $request->description,
        ]);

        return response()->json([
            'status' => true,
            'message' => 'Tạo size mới thành công',
            'data' => $size->toArray()
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $size = Size::find($id);

        if ($size) {
            return response()->json([
                'status' => true,
                'message' => 'Lấy thông tin size thành công',
                'data' => $size->toArray()
            ]);
        } else {
            return response()->json([
                'status' => false,
                'message' => 'Size không tồn tại',
                'data' => []
            ], 404);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $size = Size::find($id);

        if (!$size) {
            return response()->json([
                'status' => false,
                'message' => 'Không tìm thấy size',
                'data' => []
            ], 404);
        }

        $size->update([
            'name' => $request->name,
            'description' => $request->description,
        ]);

        return response()->json([
            'status' => true,
            'message' => 'Cập nhật size thành công',
            'data' => $size->toArray()
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        // Delete
        $size = Size::find($id);

        if (!$size) {
            return response()->json([
                'status' => false,
                'message' => 'Không tìm thấy size cần xóa',
                'data' => []
            ], 404);
        }

        $size->Delete();

        return response()->json([
            'status' => true,
            'message' => 'Xóa size thành công',
        ], 200);
    }
}
