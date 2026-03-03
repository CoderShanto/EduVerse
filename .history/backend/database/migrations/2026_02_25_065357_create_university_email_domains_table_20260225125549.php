<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('university_email_domains', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('university_id');
            $table->string('domain'); // example: bscse.uiu.ac.bd OR uiu.ac.bd
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->foreign('university_id')->references('id')->on('universities')->onDelete('cascade');
            $table->unique(['university_id','domain']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('university_email_domains');
    }
};