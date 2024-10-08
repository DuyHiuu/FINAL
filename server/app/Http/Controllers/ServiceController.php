<?php

namespace App\Http\Controllers;

use App\Http\Resources\ServiceResource;
use App\Models\Service;
use App\Http\Requests\StoreServiceRequest;
use App\Http\Requests\UpdateServiceRequest;
use Illuminate\Http\Request;

class ServiceController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $service = Service::all();

        return response()->json([
            'status' => true,
            'message' => 'Lấy danh sách thành công',
            'data' => $service
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
        $service = Service::query()->create([
            'name' => $request->name,
            'description'  => $request->description,
            'quantity' => $request->quantity,
            'price' => $request->price
        ]);
        return response()->json(new ServiceResource($service), 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $service = Service::find($id);

        if ($service) {
            return response()->json([
                'status' => true,
                'message' => 'Lấy danh sách thành công',
                'data' => $service
            ]);
        } else {
            return response()->json(['message' => 'Không tồn tại'], 404);
        }
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Service $service)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $service = Service::query()->where('id', $id)->first();

        $service ->update([
            'name' => $request->name,
            'description'  => $request->description,
            'quantity' => $request->quantity,
            'price' => $request->price
        ]);
        $arr = [
            'status' => true,
            'message' => 'Cập nhật thông tin thành công',
            'data' => new ServiceResource($service)
        ];
        return response()->json($arr, 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $service = Service::query()->where('id', $id)->first();

        if(!$service){
            $arr = [
                'status' => false,
                'message' => 'Không tìm thấy Service cần xóa',
                'data' => []
            ];
    
        }else{
            $service->delete();
            $arr = [
                'status' => true,
                'message' => 'Xóa thành công',
            ];
        }
        return response()->json($arr, 200);
    }
}
