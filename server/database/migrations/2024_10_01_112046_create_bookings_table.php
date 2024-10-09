<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('bookings', function (Blueprint $table) {
            $table->id();
            $table->date('start_date');
            $table->date('end_date');
            $table->integer('totalamount');
            $table->integer('quantity_service');
            $table->unsignedBigInteger('room_id');
            $table->unsignedBigInteger('service_id')->nullable();
            $table->unsignedBigInteger('voucher_id')->nullable();
            $table->timestamps();
            $table->foreign('room_id')->references('id')->on('rooms');
            $table->foreign('service_id')->references('id')->on('services');
            $table->foreign('voucher_id')->references('id')->on('vouchers');
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bookings');
    }
};
