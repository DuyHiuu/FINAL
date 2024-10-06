<?php

namespace App\Http\Controllers;

use App\Http\Requests\AuthRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        //kiem tra email va pass
        if(Auth::attempt(['email'=>$request->email,'password'=>$request->password],false)){
            //lay thong tin nguoi dung da dang nhap
            $user= Auth::user();

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
        $validator= Validator::make(
           $request->all(),[
                'name' => 'required',
                'email' => 'required|email|unique:users,email',

                'phone' => [
                    'required',
                    'regex:/^(0|\+84)(\s|\.)?((3[2-9])|(5[689])|(7[06-9])|(8[1-689])|(9[0-46-9]))(\d)(\s|\.)?(\d{3})(\s|\.)?(\d{3})$/',
                    'unique:users,phone'
                    ],
            'password'=> [
                'required',
                'confirmed',
                'min:8',
                'regex:/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*\W).+$/'
            ]

            ],[
                'name.required' => "Tên không được để trống",
                'email.required' => "Email không được để trống",
                'email.email'=>"Email không đúng định dạng",
                'email.unique'=>"Email đã được đăng ký",
                'phone.required'=>"Số điện thoại không được để trống",
                'phone.regex'=>"Số điện thoại không đúng định dạng",
                'phone.unique'=>"Số điện thoại đã được đăng ký",
                'password.required'=>"Mật khẩu không được để trống",
                'password.confirmed'=>"Mật khẩu không trùng khớp",
                'password.min'|'password.regex'=>"Yêu cầu mật khẩu có ít nhất 8 ký tự, chứa các chữ cái và bao gồm các ký tự đặc biệt(*@!#...)."
            ]
        );
        if($validator->fails()){
            return response()->json($validator->messages());
        }
        else{
            $data = $request->all();
            $data['password'] = bcrypt($data['password']);
            $data['role_id'] = '1';
            $data['address']= $request->address ?? null;
            $user = User::create($data);
            return response(new UserResource($user),201);
        }
    }
}
