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
        Schema::create('comments', function (Blueprint $table) {
            $table->id();
            $table->text('content'); // Nội dung comment
            $table->unsignedBigInteger('user_id');
            $table->unsignedBigInteger('room_id');
            $table->foreignId('user_id')->references('id')->on('users'); // Khóa ngoại tới bảng users
            $table->foreignId('room_id')->references('id')->on('rooms'); // Khóa ngoại tới bảng rooms
            $table->timestamps(); // created_at và updated_at
            $table->softDeletes(); // deleted_at để dùng cho soft deletes
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('comments');
    }
};
