<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('work_schedules', function (Blueprint $table) {
            $table->decimal('office_latitude', 10, 7)->nullable()->after('work_end');
            $table->decimal('office_longitude', 10, 7)->nullable()->after('office_latitude');
            $table->unsignedInteger('allowed_radius_meters')->default(100)->after('office_longitude');
        });
    }

    public function down(): void
    {
        Schema::table('work_schedules', function (Blueprint $table) {
            $table->dropColumn(['office_latitude', 'office_longitude', 'allowed_radius_meters']);
        });
    }
};
