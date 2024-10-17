<?php

namespace App\Http\Controllers;

use App\Http\Requests\UserRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Validator;


class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $user = User::join('roles', 'users.role_id', '=', 'roles.id')

            ->select(
                'users.*',
                'roles.role_name as role_names',
                'roles.description as role_description',
                'users.role_id'
            )
            ->orderBy('users.id', 'desc')
            ->whereNull('users.deleted_at')
            ->get();
        $user->makeHidden(['role_id']);
        return response()->json($user);
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
        // Xác thực dữ liệu
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,NULL,id,deleted_at,NULL', // Email không được trùng với các bản ghi chưa bị xóa
            'phone' => 'nullable|string|max:20',
            'password' => 'required|string|min:8',
            'address' => 'nullable|string|max:255',
            'role_id' => 'required|exists:roles,id',
        ]);

        try {
            // Mã hóa mật khẩu trước khi lưu
            $validatedData['password'] = bcrypt($validatedData['password']);

            // Tạo người dùng mới
            $user = User::create($validatedData);
            return response()->json($user, 201);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Không thể thêm người dùng: ' . $e->getMessage()], 500);
        }
    }







    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
        $user = User::find($id);
        if ($user) {
            return response()->json($user);
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
        $user = User::find($id);

        if (!$user) {
            return response()->json(['message' => 'Người dùng không tồn tại'], 404);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:users,email,' . $id . ',id,deleted_at,NULL',
            'phone' => 'nullable|string|max:20',
            'password' => 'nullable|string|min:6',
            'address' => 'nullable|string|max:255',
            'role_id' => 'required|exists:roles,id',
        ]);

        $user->name = $validated['name'];
        $user->email = $validated['email'];
        $user->phone = $validated['phone'] ?? $user->phone;
        $user->address = $validated['address'] ?? $user->address;
        $user->role_id = $validated['role_id'] ?? $user->role_id;

        if (!empty($validated['password'])) {
            $user->password = bcrypt($validated['password']);
        }


        if ($user->save()) {
            return response()->json(['message' => 'Cập nhật thành công', 'data' => $user->toArray()], 200);
        } else {
            return response()->json(['message' => 'Cập nhật thất bại'], 500);
        }
    }




    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $user = User::find($id);
        $user->delete();
        return response()->json([
            "message" => "delete successfully"
        ]);
    }

    // public function update_new_pass(Request $request)
    // {
    //     $data = $request->all();
    //     $token_random = Str::random();
    //     $user = User::where('email', $data['email'])->where('user_token', $data['token'])->first();
    //     if ($user) {
    //         $validator = Validator::make(
    //             $data,
    //             [
    //                 'password' => [
    //                     'required',
    //                     'confirmed',
    //                     'min:8',
    //                     'regex:/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*\W).+$/'
    //                 ]
    //             ],
    //             [
    //                 'password.required' => "Mật khẩu không được để trống",
    //                 'password.confirmed' => "Mật khẩu không trùng khớp",
    //                 'password.min' | 'password.regex' => "Yêu cầu mật khẩu có ít nhất 8 ký tự, chứa các chữ cái và bao gồm các ký tự đặc biệt(*@!#...)."
    //             ]

    //         );
    //         if ($validator->fails()) {
    //             return response()->json($validator->messages());
    //         } else {
    //             $reset = User::find($user->id);
    //             $reset->password = bcrypt($data['password']);
    //             $reset->user_token = $token_random;
    //             $reset->save();
    //             return response()->json(["message" => "Đổi mật khẩu thành công. Vui lòng đăng nhập lại"]);
    //         }
    //     } else {
    //         return response()->json(["error" => "Vui lòng thực hiện lại vì link đã quá hạn"]);
    //     }
    // }
}
