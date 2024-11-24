<?php

namespace App\Http\Middleware;

use App\Models\User;
use Closure;
use Illuminate\Http\Request;
use Laravel\Sanctum\PersonalAccessToken;
use Symfony\Component\HttpFoundation\Response;

class CheckRole
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Lấy token từ Authorization header
        $token = $request->bearerToken();

        // Xác minh token
        $accessToken = PersonalAccessToken::findToken($token);

        if (!$token || !$accessToken) {
            return response()->json(['error' => 'Phải đăng nhập mới có thể thực hiện hành động này'], 401);
        }

        // Kiểm tra model và role_id
        $model = $accessToken->tokenable_type;
        $id_user = $accessToken->tokenable_id;
        $user = User::find($id_user);

        if ($model !== "App\Models\User") {
            return response()->json(['error' => 'Token không hợp lệ'], 403);
        }

        if ($user->role_id !== 2) {
            return response()->json(['error' => 'Chỉ có admin mới truy cập được vào đây'], 403);
        }

        return $next($request);
    }
}
