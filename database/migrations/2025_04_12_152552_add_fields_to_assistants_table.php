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
        Schema::table('assistants', function (Blueprint $table) {
            $table->text('system_instructions')->nullable();  // Instruksi sistem untuk assistant
            $table->string('model')->default('gpt-4');  // Model default untuk assistant
            $table->boolean('file_search')->default(false);  // Mengaktifkan file search atau tidak
            $table->boolean('code_interpreter')->default(false);  // Mengaktifkan code interpreter atau tidak
            $table->json('functions')->nullable();  // Menyimpan fungsi-fungsi terkait
        });
    }

    public function down()
    {
        Schema::table('assistants', function (Blueprint $table) {
            $table->dropColumn('system_instructions');
            $table->dropColumn('model');
            $table->dropColumn('file_search');
            $table->dropColumn('code_interpreter');
            $table->dropColumn('functions');
        });
    }
};
