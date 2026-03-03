<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('idea_updates', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('idea_id');
            $table->unsignedBigInteger('user_id');
            $table->text('content');
            $table->enum('proof_type', ['github','demo','pdf','image','link'])->nullable();
            $table->string('proof_url')->nullable();
            $table->timestamps();

            $table->index('idea_id');
            $table->index('user_id');

            $table->foreign('idea_id')->references('id')->on('problem_ideas')->onDelete('cascade');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('idea_updates');
    }
};