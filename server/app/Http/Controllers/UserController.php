<?php

namespace App\Http\Controllers;

use App\Http\Requests\UserRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use Dotenv\Validator;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return UserResource::collection(User::all());
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
        $user=User::find($id);
        $data = $request->validated();
        $data['password'] = bcrypt($data['password']);
        $data['address']= $request->address ?? $user->address;
        $user = User::update($data);
        return response(new UserResource($user),201);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }

    public function update_new_pass(Request $request)
    {
        $data =$request->all();
        $token_random = Str::random();
        $user = User::where('email',$data['email'])->where('user_token',$data['token'])->first();
        if($user){
            $validator = Validator::make(
                $data,
                [
                    'password' => [
                        'required',
                        'confirmed',
                        'min:8',
                        'regex:/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*\W).+$/'
                    ]
                ],
                [
                    'password.required'=>"Mật khẩu không được để trống",
                    'password.confirmed'=>"Mật khẩu không trùng khớp",
                    'password.min'|'password.regex'=>"Yêu cầu mật khẩu có ít nhất 8 ký tự, chứa các chữ cái và bao gồm các ký tự đặc biệt(*@!#...)."
                ]

            );
            if ($validator->fails()) {
                return response()->json($validator->messages());
            } else {
                $reset = User::find($user->id);
                $reset->password = bcrypt($data['password']);
                $reset->user_token = $token_random;
                $reset->save();
                return response()->json(["message" => "Đổi mật khẩu thành công. Vui lòng đăng nhập lại"]);
            }
        } else {
            return response()->json(["error" => "Vui lòng thực hiện lại vì link đã quá hạn"]);
        }
    }

}
