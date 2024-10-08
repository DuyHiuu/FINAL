<?php

namespace App\Http\Controllers;

use App\Http\Requests\UserRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // return UserResource::collection(User::all());

        $user = User::join('roles', 'users.role_id', '=', 'roles.id')
            ->select('users.*', 'roles.name as role_name', 'roles.description as role_description')
            ->orderBy('users.id', 'desc')
            ->whereNull('users.deleted_at')
            ->get();
        $user->makeHidden(['role_id']);
        return response()->json([
            'status' => true,
            'message' => 'Lấy danh sách thành công',
            'data' => $user
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
    public function store(UserRequest $request)
    {
        $data = $request->validated();
        $data['password'] = bcrypt($data['password']);
        $data['address']= $request->address ?? null;
        $user = User::create($data);
        return response(new UserResource($user),201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        // $user = User::find($id);
        $user = User::join('roles', 'users.role_id', '=', 'roles.id')
            ->select('users.*', 'roles.name as role_name', 'roles.description as role_description')
            ->where('users.id', $id)
            ->whereNull('users.deleted_at')
            ->first();
        if ($user) {
            return response()->json([
                'status' => true,
                'message' => 'Lấy danh sách thành công',
                'data' => $user
            ]);
        } else {
            return response()->json(['message' => 'Không tồn tại'], 404);
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
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
