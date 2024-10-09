<?php

namespace App\Http\Controllers;

use App\Http\Resources\ServiceResource;
use App\Models\Service;
use App\Http\Requests\StoreServiceRequest;
use App\Http\Requests\UpdateServiceRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator as FacadesValidator;

class ServiceController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $service = Service::all();

        return response()->json($service);
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
        // Validate the incoming request
        $validator = FacadesValidator::make(
            $request->all(),[
                'name' => 'required|max:255',
                'description' => 'required|max:255',
                'price' => 'required|numeric|min:0',
        ],[
            'name.required' => 'Tên dịch vụ không được để trống',
            'name.max' => 'Tên dịch vụ không được vượt 255 kí tự',
            'description.required' => 'Mô tả không được để trống',
            'description.max' => 'Mô tả không vượt quá 255 kí tự',
            'price.required' => 'Giá dịch vụ không được để trống',
            'price.numeric' => 'Giá dịch vụ phải là số',
            'price.min' => 'Giá dịch vụ phải lớn hơn 0 hoặc bằng 0',
            ]
        );

        if ($validator->fails()) {
            return response()->json(['status'=>'error','message'=>$validator->messages()], 400);
        }

        try {

            $name = $request->get('name');
            $description = $request->get('description');
            $price = $request->get('price');

            $data = [
                'name' => $name,
                'description' => $description,
                'price' => $price,
            ];

            Service::create($data);

            return response()->json(['status'=>'success','message'=>'Dịch vụ đã được thêm thành công','data'=>$data], 200);
        } catch (\Exception $e) {
            return response()->json(['status'=>'error','message'=>$e->getMessage()], 500);
    }
}

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $service = Service::find($id);
        if ($service) {
            return response()->json($service);
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
    public function update(Request $request, String $id)
    {
        $service = Service::find($id);
        $validator = FacadesValidator::make(
            $request->all(),[
                'name' => 'required|max:255',
                'description' => 'required|max:255',
                'price' => 'required|numeric|min:0',
        ],[
            'name.required' => 'Tên dịch vụ không được để trống',
            'name.max' => 'Tên dịch vụ không được vượt 255 kí tự',
            'description.required' => 'Mô tả không được để trống',
            'description.max' => 'Mô tả không vượt quá 255 kí tự',
            'price.required' => 'Giá dịch vụ không được để trống',
            'price.numeric' => 'Giá dịch vụ phải là số',
            'price.min' => 'Giá dịch vụ phải lớn hơn 0 hoặc bằng 0',
            ]
        );

        if ($validator->fails()) {
            return response()->json(['status'=>'error','message'=>$validator->messages()], 400);
        }

        $service->update($request->all());

        return response()->json(['message'=>'Cập nhập thành công'],200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(String $id)
    {
        $service=Service::find($id);
        $service->delete();
        return response()->json([
            "message" => "Xóa thành công"
        ]);
    }
}
