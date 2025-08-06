<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
  /**
   * Run the migrations.
   */
  public function up()
  {
    Schema::create('assistants', function (Blueprint $table) {
      $table->id();
      $table->string('name');
      $table->unsignedBigInteger('vector_store_id')->nullable();
      $table->timestamps();

      $table->index('vector_store_id');
      $table->index('created_at');
    });
  }


  /**
   * Reverse the migrations.
   */
  public function down(): void
  {
    Schema::dropIfExists('assistants');
  }
};
