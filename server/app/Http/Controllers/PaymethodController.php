<?php

namespace App\Http\Controllers;

use App\Models\Paymethod;
use App\Http\Requests\StorePaymethodRequest;
use App\Http\Requests\UpdatePaymethodRequest;

class PaymethodController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $paymethod = Paymethod::all();
        // ->whereNull('paymethods.deleted_at');
        return response()->json([
            'status' => true,
            'message' => 'Lấy danh sách thành công',
            'data' => $paymethod
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
    public function store(StorePaymethodRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $paymethod = Paymethod::find($id);
        if ($paymethod) {
            return response()->json($paymethod);
        } else {
            return response()->json(['message' => 'Không tồn tại'], 404);
        }
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Paymethod $paymethod)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdatePaymethodRequest $request, Paymethod $paymethod)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Paymethod $paymethod)
    {
        //
    }
}
