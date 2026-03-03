<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('problem_ideas', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('problem_id');
            $table->unsignedBigInteger('user_id');
            $table->string('title');
            $table->text('description');
            $table->unsignedInteger('votes_count')->default(0);
            $table->boolean('is_selected')->default(0);
            $table->timestamps();

            $table->index('problem_id');
            $table->index('user_id');
            $table->index('votes_count');
            $table->index('is_selected');

            $table->foreign('problem_id')->references('id')->on('problems')->onDelete('cascade');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('problem_ideas');
    }
};