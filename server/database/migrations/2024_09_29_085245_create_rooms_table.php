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
        Schema::create('rooms', function (Blueprint $table) {
            $table->id();
            $table->integer('price');
            $table->string('description');
            $table->string('statusroom');
            $table->unsignedBigInteger('size_id');
            $table->unsignedBigInteger('roomImg_id');
            $table->timestamps();
            $table->foreign('size_id')->references('id')->on('sizes');
            $table->foreign('roomImg_id')->references('id')->on('room_images');
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('rooms');
    }
};
