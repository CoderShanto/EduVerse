<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('idea_feedback', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('update_id');
            $table->unsignedBigInteger('mentor_id'); // admin/instructor id
            $table->text('comment');
            $table->tinyInteger('score')->nullable(); // 1-10
            $table->timestamps();

            $table->index('update_id');
            $table->index('mentor_id');

            $table->foreign('update_id')->references('id')->on('idea_updates')->onDelete('cascade');
            $table->foreign('mentor_id')->references('id')->on('users')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('idea_feedback');
    }
};