<?php

namespace App\Http\Controllers;

use App\Models\Role;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class RoleController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $role = Role::all();

        return response()->json($role);
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
        $validator = Validator::make($request->all(), [
            'role_name' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $role = Role::create([
            'role_name' => $request->role_name,
            'description' => $request->description,
        ]);

        return response()->json(['message' => 'Role created successfully', 'role' => $role], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $role = Role::find($id);

        if ($role) {
            return response()->json($role);
        } else {
            return response()->json([
                'status' => false,
                'message' => 'Role không tồn tại',
                'data' => []
            ], 404);
        }
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $role = Role::find($id);

        if (!$role) {
            return response()->json(['message' => 'Role not found'], 404);
        }

        $validator = Validator::make($request->all(), [
            'role_name' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $role->update([
            'role_name' => $request->role_name,
            'description' => $request->description,
        ]);

        return response()->json(['message' => 'Role updated successfully', 'role' => $role]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $role = Role::find($id);

        if (!$role) {
            return response()->json([
                'status' => false,
                'message' => 'Không tìm thấy role cần xóa',
                'data' => []
            ], 404);
        }

        $role->Delete();

        return response()->json([
            'status' => true,
            'message' => 'Xóa role thành công',
        ], 200);
    }
}
