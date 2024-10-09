<?php

namespace App\Http\Controllers;


use App\Models\Voucher;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator as FacadesValidator;

class VoucherController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $vouchers = Voucher::all();

        return response()->json($vouchers);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //phamtien
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // Validate the incoming request
        $validator = FacadesValidator::make(
            $request->all(),[
                'name' =>'required|max:255',
                'code' => 'required|unique:vouchers,code',
                'discount' => 'required|numeric|min:0',
                'start_date' => 'required|date|before:end_date',
                'end_date' => 'required|date|after:start_date',
                'quantity' => 'required|numeric|min:0',
        ],[
            'name.required' =>'Tên không được để trống',
            'name.max' => 'Tên không được vượt quá 255 kí tự',
            'code.required' => 'Mã phiếu không được để trống',
            'code.unique' => 'Mã phiếu không được phép trùng nhau',
            'discount.required' => 'Mức giảm không được để trống',
            'discount.numeric' => 'Mức giảm phải là số',
            'discount.min' => 'Mức giảm phải lớn hơn hoặc bằng 0',
            'start_date.required' => 'Ngày bắt đầu không được để trống',
            'start_date.date' => 'Định dạng ngày không đúng',
            'start_date.before' => 'Ngày bắt đầu phải trước ngày kết thúc',
            'end_date.required' => 'Ngày kết thúc không được để trống',
            'end_date.date' => 'Định dạng ngày không đúng',
            'end_date.after' => 'Ngày kết thúc phải sau ngày bắt đầu',
            'quantity.required' => 'Số lượng không được để trống',
            'quantity.numeric' => 'Số lượng phải là số',
            'quantity.min' => 'Số lượng phải lớn hơn hoặc bằng 0',
            ]
        );

        if ($validator->fails()) {
            return response()->json(['status'=>'error','message'=>$validator->messages()], 400);
        }

        try {

            $name = $request->get('name');
            $code = $request->get('code');
            $discount = $request->get('discount');
            $start_date = $request->get('start_date');
            $end_date = $request->get('end_date');
            $quantity = $request->get('quantity');

            $data = [
                'name' => $name,
                'code' => $code,
                'discount' => $discount,
                'start_date' => $start_date,
                'end_date' => $end_date,
                'quantity' => $quantity,
            ];

            Voucher::create($data);

            return response()->json(['status'=>'success','message'=>'Phiếu giảm giá đã được thêm thành công','data'=>$data], 200);
        } catch (\Exception $e) {
            return response()->json(['status'=>'error','message'=>$e->getMessage()], 500);
    }
}

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $voucher = Voucher::find($id);
        if ($voucher) {
            return response()->json($voucher);
        } else {
            return response()->json(['message' => 'Không tồn tại'], 404);
        }
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit()
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, String $id)
    {
        $voucher = Voucher::find($id);
        $validator = FacadesValidator::make(
            $request->all(),[
                'name' =>'required|max:255',
                'code' => 'required',
                'discount' => 'required|numeric|min:0',
                'start_date' => 'required|date|before:end_date',
                'end_date' => 'required|date|after:start_date',
                'quantity' => 'required|numeric|min:0',
        ],[
            'name.required' =>'Tên không được để trống',
            'name.max' => 'Tên không được vượt quá 255 kí tự',
            'code.required' => 'Mã phiếu không được để trống',
            'discount.required' => 'Mức giảm không được để trống',
            'discount.numeric' => 'Mức giảm phải là số',
            'discount.min' => 'Mức giảm phải lớn hơn hoặc bằng 0',
            'start_date.required' => 'Ngày bắt đầu không được để trống',
            'start_date.date' => 'Định dạng ngày không đúng',
            'start_date.before' => 'Ngày bắt đầu phải trước ngày kết thúc',
            'end_date.required' => 'Ngày kết thúc không được để trống',
            'end_date.date' => 'Định dạng ngày không đúng',
            'end_date.after' => 'Ngày kết thúc phải sau ngày bắt đầu',
            'quantity.required' => 'Số lượng không được để trống',
            'quantity.numeric' => 'Số lượng phải là số',
            'quantity.min' => 'Số lượng phải lớn hơn hoặc bằng 0',
            ]
        );

        if ($validator->fails()) {
            return response()->json(['status'=>'error','message'=>$validator->messages()], 400);
        }

        $voucher->update($request->all());

        return response()->json(['message'=>'Cập nhập thành công'],200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(String $id)
    {
        $voucher = Voucher::find($id);
        $voucher->delete();
        return response()->json([
            "message" => "Xóa thành công"
        ]);
    }
}
