<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('certificates', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id');
            $table->unsignedBigInteger('course_id');

            $table->string('certificate_no')->unique();
            $table->timestamp('issued_at')->nullable();

            // if later you generate PDF
            $table->string('pdf_path')->nullable();

            $table->enum('status', ['issued', 'revoked'])->default('issued');

            $table->timestamps();

            $table->unique(['user_id', 'course_id']); // ✅ prevent duplicates

            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('course_id')->references('id')->on('courses')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('certificates');
    }
};