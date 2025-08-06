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
    Schema::create('threads', function (Blueprint $table) {
      $table->id();
      $table->unsignedBigInteger('assistant_id');
      $table->timestamps();

      $table->index('assistant_id');
      $table->index('created_at');
    });
  }


  /**
   * Reverse the migrations.
   */
  public function down(): void
  {
    Schema::dropIfExists('threads');
  }
};
