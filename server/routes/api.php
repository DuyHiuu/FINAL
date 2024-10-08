<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\BlogController;
use App\Http\Controllers\BookingController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\PaymethodController;
use App\Http\Controllers\RoomController;
use App\Http\Controllers\ServiceController;
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
Route::match(['GET','POST'],'/login',[AuthController::class,'login']);
Route::post('/register', [AuthController::class, 'register']);
Route::post('/logout',[AuthController::class,'logout']);
Route::prefix('rooms')->group(function () {
    Route::get('/', [RoomController::class, 'index']);
    Route::post('/', [RoomController::class, 'store']);
    Route::get('/{id}', [RoomController::class, 'show']);

});
Route::prefix('services')->group(function () {
    Route::get('/', [ServiceController::class, 'index']);

    Route::get('/{id}', [ServiceController::class, 'show']);

});
Route::prefix('blogs')->group(function () {
    Route::get('/', [BlogController::class, 'index']);

    Route::get('/{id}', [BlogController::class, 'show']);

});

Route::resource('paymethods', PaymethodController::class);
Route::resource('payments', PaymentController::class);
Route::resource('bookings', BookingController::class);
