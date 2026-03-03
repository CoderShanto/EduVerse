<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('idea_showcases', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('idea_id')->unique();

            $table->text('summary')->nullable();
            $table->string('tech_stack')->nullable();

            $table->string('repo_url')->nullable();
            $table->string('demo_url')->nullable();
            $table->string('report_url')->nullable();
            $table->string('cover_image')->nullable(); // store URL or file path

            $table->tinyInteger('score')->nullable(); // 1-10
            $table->timestamps();

            $table->foreign('idea_id')->references('id')->on('problem_ideas')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('idea_showcases');
    }
};
