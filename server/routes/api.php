<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\BlogController;
use App\Http\Controllers\BookingController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\PaymethodController;
use App\Http\Controllers\PayReturnController;
use App\Http\Controllers\RatingController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\RoomController;
use App\Http\Controllers\RoomImageController;
use App\Http\Controllers\SizeController;
use App\Http\Controllers\ServiceController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\StatisticalController;
use App\Http\Controllers\VoucherController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

//Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
//    return $request->user();
//});
Route::get('test-email', [HomeController::class, 'testEmail']);
Route::match(['GET', 'POST'], '/login', [AuthController::class, 'login'])->name('login');
Route::post('/register', [AuthController::class, 'register']);
Route::post('/logout', [AuthController::class, 'logout'])->name('logout')->middleware('auth:sanctum');
Route::get('/room_home', [HomeController::class, 'room_home'])->name('room_home');
Route::get('/blog_home', [HomeController::class, 'blog_home'])->name('blog_home');
Route::get('/top_three', [HomeController::class, 'top_three'])->name('top_three');
Route::post('/check_payment', [PaymentController::class, 'check_payment']);
Route::post('/forgot_password', [UserController::class, 'forgot_password']);
Route::post('/update_new_pass', [UserController::class, 'update_new_pass'])->name('update_new_pass');


Route::prefix('rooms')->group(function () {
    Route::get('/', [RoomController::class, 'index']);
    Route::get('/{id}', [RoomController::class, 'show']);
    Route::middleware('checkrole')->group(function () {
        Route::post('/', [RoomController::class, 'store']);
        Route::put('/{id}', [RoomController::class, 'update']);
        Route::delete('/{id}', [RoomController::class, 'destroy']);
    });
});


Route::prefix('sizes')->group(function () {
    Route::get('/', [SizeController::class, 'index']);
    Route::get('/{id}', [SizeController::class, 'show']);
    route::middleware('checkrole')->group(function () {
        Route::post('/', [SizeController::class, 'store']);
        Route::put('/{id}', [SizeController::class, 'update']);
        Route::delete('/{id}', [SizeController::class, 'destroy']);
    });
});

Route::prefix('services')->group(function () {
    Route::get('/', [ServiceController::class, 'index']);
    Route::get('/{id}', [ServiceController::class, 'show']);
    route::middleware('checkrole')->group(function () {
        Route::post('/', [ServiceController::class, 'store']);
        Route::put('/{id}', [ServiceController::class, 'update']);
        Route::delete('/{id}', [ServiceController::class, 'destroy']);
    });
});

Route::prefix('blogs')->group(function () {
    Route::get('/', [BlogController::class, 'index']);
    Route::post('/', [BlogController::class, 'store']);
    Route::get('/{id}', [BlogController::class, 'show']);
    Route::put('/{id}', [BlogController::class, 'update']);
    Route::delete('/{id}', [BlogController::class, 'destroy']);
});

// route::middleware('checkrole')->group(function () {
Route::prefix('chart')->group(function () {
    Route::get('/', [StatisticalController::class, 'total_revenue']);
});
// });

Route::prefix('vouchers')->group(function () {
    Route::get('/', [VoucherController::class, 'index']);
    Route::get('/listVoucher', [VoucherController::class, 'paymentVoucher']);
    Route::get('/{id}', [VoucherController::class, 'show']);
    route::middleware('checkrole')->group(function () {
        Route::post('/', [VoucherController::class, 'store']);
        Route::put('/{id}', [VoucherController::class, 'update']);
        Route::delete('/{id}', [VoucherController::class, 'destroy']);
    });
});


Route::prefix('bookings')->group(function () {
    Route::get('/{id}', [BookingController::class, 'listBooking']);
    Route::post('/', [BookingController::class, 'addBooking']);
});

Route::prefix('contacts')->group(function () {
    Route::get('/', [ContactController::class, 'index']);
    Route::get('/{id}', [ContactController::class, 'show']);
    Route::post('/', [ContactController::class, 'store']);
});

Route::prefix('admin')->group(function () {
    //thống kê
    Route::post('/total_revenue', [StatisticalController::class, "total_revenue"])->name('total_revenue');
    Route::post('/rtop3', [StatisticalController::class, "get_top3_room"])->name('rtop3');
});

Route::prefix('roles')->group(function () {
    Route::get('/', [RoleController::class, 'index']);
    Route::post('/', [RoleController::class, 'store']);
    Route::get('/{id}', [RoleController::class, 'show']);
    Route::put('/{id}', [RoleController::class, 'update']);
    Route::delete('/{id}', [RoleController::class, 'destroy']);
});

Route::prefix('payments')->group(function () {
    Route::get('/list/{id}', [PaymentController::class, 'index']);
    Route::get('/', [PaymentController::class, 'payAd']);
    Route::post('/', [PaymentController::class, 'store']);
    Route::post('/vn_pay', [PaymentController::class, 'vn_payment']);
    Route::post('/pay_on_check', [PaymentController::class, 'check_payment']);
    Route::get('/{id}', [PaymentController::class, 'show']);
    Route::put('/{id}', [PaymentController::class, 'update']);
    Route::delete('/{id}', [PaymentController::class, 'destroy']);
    Route::post('/cancel_pay/{id}', [PaymentController::class, 'cancelPay']);
    Route::post('/return_pay', [PaymentController::class, 'returnPay']);
});

Route::prefix('pay_return')->group(function () {
    Route::get('/', [PayReturnController::class, 'listReturnPay']);
    Route::get('/{id}', [PayReturnController::class, 'detailReturnPay']);
});

Route::prefix('comments')->group(function () {
    Route::get('/', [CommentController::class, 'index']);
    Route::post('/', [CommentController::class, 'store']);
    Route::get('/{id}', [CommentController::class, 'show']);
    Route::put('/{id}', [CommentController::class, 'update']);
    Route::delete('/{id}', [CommentController::class, 'destroy']);
});

Route::prefix('users')->group(function () {
    Route::get('/', [UserController::class, 'index']);
    Route::get('/{id}', [UserController::class, 'show']);
    Route::post('/', [UserController::class, 'store']);
    Route::put('/{id}', [UserController::class, 'update']);
    Route::delete('/{id}', [UserController::class, 'destroy']);
});

Route::prefix('paymethods')->group(function () {
    Route::get('/', [PaymethodController::class, 'index']);
});

Route::prefix('roomImages')->group(function () {
    Route::get('/', [RoomImageController::class, 'index']);
    Route::post('/', [RoomImageController::class, 'store']);
    Route::get('/{id}', [RoomImageController::class, 'show']);
    Route::put('/{id}', [RoomImageController::class, 'update']);
    Route::delete('/{id}', [RoomImageController::class, 'destroy']);
});

// Route::middleware('auth:sanctum')->group(function () {
Route::post('/ratings', [RatingController::class, 'store']);
Route::put('/ratings/{id}', [RatingController::class, 'update']);
Route::delete('/ratings/{id}', [RatingController::class, 'destroy']);
// });
Route::get('/ratings', [RatingController::class, 'index']);
Route::get('/ratings/{id}', [RatingController::class, 'show']);


Route::get('/activate/{token}', [UserController::class, 'activate'])->name('user.active');
