<?php

namespace App\Http\Controllers;


use App\Models\Voucher;
// use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator as FacadesValidator;
use Illuminate\Support\Facades\Validator;

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
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // Kiểm tra nếu loại phiếu là 'amount' mà không có max_total_amount, gán giá trị mặc định
        if ($request->type === 'amount' && !$request->max_total_amount) {
            $request->merge(['max_total_amount' => 0]);
        }

        $validator = Validator::make(
            $request->all(),
            [
                'name' => 'required|max:255',
                'code' => 'required|unique:vouchers,code',
                'type' => 'required|in:amount,%',
                'discount' => 'required|numeric|min:0',
                'start_date' => 'required|date|before:end_date',
                'end_date' => 'required|date|after:start_date',
                'quantity' => 'required|numeric|min:1',
                'min_total_amount' => 'nullable|numeric|min:0',
                'max_total_amount' => 'nullable|numeric|min:0',
            ],
            [
                'name.required' => 'Tên không được để trống.',
                'name.max' => 'Tên không được vượt quá 255 kí tự.',
                'code.required' => 'Mã phiếu không được để trống.',
                'code.unique' => 'Mã phiếu không được phép trùng nhau.',
                'type.required' => 'Loại phiếu không được để trống.',
                'type.in' => 'Loại phiếu không hợp lệ.',
                'discount.required' => 'Mức giảm không được để trống.',
                'discount.numeric' => 'Mức giảm phải là số.',
                'discount.min' => 'Mức giảm phải lớn hơn hoặc bằng 0.',
                'start_date.required' => 'Ngày bắt đầu không được để trống.',
                'start_date.before' => 'Ngày bắt đầu phải trước ngày kết thúc.',
                'end_date.required' => 'Ngày kết thúc không được để trống.',
                'end_date.after' => 'Ngày kết thúc phải sau ngày bắt đầu.',
                'quantity.required' => 'Số lượng không được để trống.',
                'quantity.numeric' => 'Số lượng phải là số.',
                'quantity.min' => 'Số lượng phải lớn hơn hoặc bằng 1.',
                'min_total_amount.numeric' => 'Tổng tiền tối thiểu phải là số.',
                'min_total_amount.min' => 'Tổng tiền tối thiểu phải lớn hơn hoặc bằng 0.',
            ]
        );

        $validator->after(function ($validator) use ($request) {
            if ($request->type === '%' && (!$request->max_total_amount || $request->discount > 100)) {
                $validator->errors()->add('discount', 'Mức giảm không được vượt quá 100% và tổng tiền tối đa phải được nhập.');
            }

            // if ($request->type === 'amount' && $request->max_total_amount) {
            //     $validator->errors()->add('max_total_amount', 'Tổng tiền tối đa không được nhập khi loại phiếu là "amount".');
            // }

            // if ($request->min_total_amount && $request->max_total_amount && $request->min_total_amount > $request->max_total_amount) {
            //     $validator->errors()->add('min_total_amount', 'Tổng tiền tối thiểu không được lớn hơn tổng tiền tối đa.');
            //     $validator->errors()->add('max_total_amount', 'Tổng tiền tối đa phải lớn hơn tổng tiền tối thiểu.');
            // }
        });

        if ($validator->fails()) {
            return response()->json(['status' => 'error', 'errors' => $validator->messages()], 400);
        }

        $data = $request->only([
            'name',
            'code',
            'type',
            'discount',
            'start_date',
            'end_date',
            'quantity',
            'min_total_amount',
            'max_total_amount',
        ]);
        $data['is_active'] = true;

        Voucher::create($data);

        return response()->json(['status' => 'success', 'message' => 'Phiếu giảm giá đã được thêm thành công'], 201);
    }


    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $voucher = Voucher::findOrFail($id);

        if ($request->type === 'amount' && !$request->max_total_amount) {
            $request->merge(['max_total_amount' => 0]);
        }

        $validator = Validator::make(
            $request->all(),
            [
                'name' => 'required|max:255',
                'code' => 'required|unique:vouchers,code,' . $id,
                'type' => 'required|in:amount,%',
                'discount' => 'required|numeric|min:0',
                'start_date' => 'required|date|before:end_date',
                'end_date' => 'required|date|after:start_date',
                'quantity' => 'required|numeric|min:1',
                'min_total_amount' => 'nullable|numeric|min:0',
                'max_total_amount' => 'nullable|numeric|min:0',
            ]
        );

        $validator->after(function ($validator) use ($request) {
            if ($request->type === '%' && (!$request->max_total_amount || $request->discount > 100)) {
                $validator->errors()->add('discount', 'Mức giảm không được vượt quá 100% và tổng tiền tối đa phải được nhập.');
            }

            // if ($request->type === 'amount' && $request->max_total_amount) {
            //     $validator->errors()->add('max_total_amount', 'Tổng tiền tối đa không được nhập khi loại phiếu là "amount".');
            // }

            // if ($request->min_total_amount && $request->max_total_amount && $request->min_total_amount > $request->max_total_amount) {
            //     $validator->errors()->add('min_total_amount', 'Tổng tiền tối thiểu không được lớn hơn tổng tiền tối đa.');
            //     $validator->errors()->add('max_total_amount', 'Tổng tiền tối đa phải lớn hơn tổng tiền tối thiểu.');
            // }
        });

        if ($validator->fails()) {
            return response()->json(['status' => 'error', 'errors' => $validator->messages()], 400);
        }

        $voucher->update($request->all());

        return response()->json(['status' => 'success', 'message' => 'Phiếu giảm giá đã được cập nhật thành công'], 200);
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
    // public function update(Request $request, String $id)
    // {
    //     $voucher = Voucher::find($id);
    //     $validator = FacadesValidator::make(
    //         $request->all(),[
    //             'name' =>'required|max:255',
    //             'code' => 'required',
    //             'type' => 'required',
    //             'discount' => 'required|numeric|min:0',
    //             'start_date' => 'required|date|before:end_date',
    //             'end_date' => 'required|date|after:start_date',
    //             'quantity' => 'required|numeric|min:0',
    //             'min_total_amount' => 'required|numeric|min:0',
    //     ],[
    //         'name.required' =>'Tên không được để trống',
    //         'name.max' => 'Tên không được vượt quá 255 kí tự',
    //         'code.required' => 'Mã phiếu không được để trống',
    //         'type.required' => 'Loại phiếu không được để trống',
    //         'discount.required' => 'Mức giảm không được để trống',
    //         'discount.numeric' => 'Mức giảm phải là số',
    //         'discount.min' => 'Mức giảm phải lớn hơn hoặc bằng 0',
    //         'start_date.required' => 'Ngày bắt đầu không được để trống',
    //         'start_date.date' => 'Định dạng ngày không đúng',
    //         'start_date.before' => 'Ngày bắt đầu phải trước ngày kết thúc',
    //         'end_date.required' => 'Ngày kết thúc không được để trống',
    //         'end_date.date' => 'Định dạng ngày không đúng',
    //         'end_date.after' => 'Ngày kết thúc phải sau ngày bắt đầu',
    //         'quantity.required' => 'Số lượng không được để trống',
    //         'quantity.numeric' => 'Số lượng phải là số',
    //         'quantity.min' => 'Số lượng phải lớn hơn hoặc bằng 0',
    //         'min_total_amount.required' => 'Tổng tiền tối thiểu không được bỏ trống',
    //         'min_total_amount.numeric' => 'Tổng tiền tối thiểu phải là số',
    //         'min_total_amount.min' => 'Tổng tiền tối thiểu phải lớn hơn hoặc bằng 0',
    //         ]
    //     );

    //     if ($validator->fails()) {
    //         return response()->json(['status'=>'error','message'=>$validator->messages()], 400);
    //     }

    //     $voucher->update($request->all());

    //     return response()->json(['message'=>'Cập nhập thành công'],200);
    // }

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

    public function paymentVoucher(Request $request)
    {
        $vouchers = Voucher::where('is_active', true)
            ->where('min_total_amount', '<', $request->total_amount)
            ->where('max_total_amount', '>', $request->total_amount)
            ->get();

        return response()->json($vouchers);
    }
}
