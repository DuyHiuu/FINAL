<?php

namespace App\Http\Controllers;

use App\Http\Requests\AuthRequest;
use App\Http\Resources\UserResource;
use App\Mail\RegisterConfirm;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        //kiem tra email va pass
        if(Auth::attempt(['email'=>$request->email,'password'=>$request->password],false)){
            //lay thong tin nguoi dung da dang nhap
            $user= Auth::user();

            if ($user->is_active === 0) {
                return response([
                    'error' => 'Tài khoản của bạn chưa được kích hoạt. Vui lòng kiểm tra email để kích hoạt.',
                ], 403);
            }

            //tao token
            $token = $user->createToken($user->email . 'token')->plainTextToken;
            $users = new UserResource($user);
            return response([
                'user'=>$users,
                'accessToken'=>$token,
            ],200);
        }
        else{
            return response([
                'error'=>'Thông tin tài khoản hoặc mật khẩu không chính xác'
            ],422);
        }
    }
    public function register(Request $request)
    {
        $validator = Validator::make(
            $request->all(),
            [
                'name' => 'required|string|max:255',
                'email' => 'required|email|unique:users,email',
                'phone' => [
                    'required',
                    'regex:/^(0|\+84)(\s|\.)?((3[2-9])|(5[689])|(7[06-9])|(8[1-689])|(9[0-46-9]))(\d)(\s|\.)?(\d{3})(\s|\.)?(\d{3})$/',
                    'unique:users,phone'
                ],
                'password' => [
                    'required',
                    'confirmed',
                    'min:8',
                    'regex:/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*\W).+$/'
                ]
            ],
            [
                'name.required' => "Tên không được để trống",
                'email.required' => "Email không được để trống",
                'email.email' => "Email không đúng định dạng",
                'email.unique' => "Email đã được đăng ký",
                'phone.required' => "Số điện thoại không được để trống",
                'phone.regex' => "Số điện thoại không đúng định dạng",
                'phone.unique' => "Số điện thoại đã được đăng ký",
                'password.required' => "Mật khẩu không được để trống",
                'password.confirmed' => "Mật khẩu không trùng khớp",
                'password.min' => "Yêu cầu mật khẩu có ít nhất 8 ký tự.",
                'password.regex' => "Mật khẩu phải bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt."
            ]
        );
    
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->messages()], 422);
        }
    
        // Tạo tài khoản người dùng
        $data = $request->all();
        $data['password'] = bcrypt($data['password']);
        $data['role_id'] = 1;
        $data['is_active'] = 0; // Chưa kích hoạt
        $user = User::create($data);
    
        // Gửi email kích hoạt
        Mail::to($user->email)->send(new RegisterConfirm($user));
    
        return response()->json([
            'message' => 'Đăng ký thành công! Vui lòng kiểm tra email để kích hoạt tài khoản.',
            'user' => new UserResource($user)
        ], 201);
    }
    
    public function logout(Request $request)
    {
        $user=$request->user();
        //huy token
        $user->currentAccessToken()->delete();
        return response(['mesage'=>"Đăng xuất thành công"],200);
    }
}
