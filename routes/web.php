<?php

use App\Http\Controllers\Admin\AttendanceController as AdminAttendanceController;
use App\Http\Controllers\Admin\DashboardController as AdminDashboardController;
use App\Http\Controllers\Admin\UserManagementController;
use App\Http\Controllers\Admin\WorkScheduleController;
use App\Http\Controllers\User\AttendanceController as UserAttendanceController;
use App\Http\Controllers\User\DashboardController as UserDashboardController;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;

Route::inertia('/', 'welcome', [
    'canRegister' => Features::enabled(Features::registration()),
])->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Auth::user()->isAdmin()
            ? redirect()->route('admin.dashboard')
            : redirect()->route('user.dashboard');
    })->name('dashboard');

    Route::middleware('role:admin')->prefix('admin')->name('admin.')->group(function () {
        Route::get('dashboard', [AdminDashboardController::class, 'index'])->name('dashboard');
        Route::get('users', [UserManagementController::class, 'index'])->name('users.index');
        Route::patch('users/{user}/role', [UserManagementController::class, 'updateRole'])->name('users.update-role');

        Route::get('settings', [WorkScheduleController::class, 'edit'])->name('settings');
        Route::patch('settings/work-schedule', [WorkScheduleController::class, 'update'])->name('settings.work-schedule');

        Route::get('attendance', [AdminAttendanceController::class, 'index'])->name('attendance.index');
        Route::get('attendance/create', [AdminAttendanceController::class, 'create'])->name('attendance.create');
        Route::post('attendance', [AdminAttendanceController::class, 'store'])->name('attendance.store');
        Route::get('attendance/{attendance}', [AdminAttendanceController::class, 'show'])->name('attendance.show');
        Route::patch('attendance/{attendance}', [AdminAttendanceController::class, 'update'])->name('attendance.update');
        Route::delete('attendance/{attendance}', [AdminAttendanceController::class, 'destroy'])->name('attendance.destroy');
    });

    Route::middleware('role:user')->prefix('user')->name('user.')->group(function () {
        Route::get('dashboard', [UserDashboardController::class, 'index'])->name('dashboard');

        Route::get('attendance', [UserAttendanceController::class, 'index'])->name('attendance.index');
        Route::get('attendance/today', [UserAttendanceController::class, 'today'])->name('attendance.today');
        Route::post('attendance/check-in', [UserAttendanceController::class, 'checkIn'])->name('attendance.check-in');
        Route::patch('attendance/check-out', [UserAttendanceController::class, 'checkOut'])->name('attendance.check-out');
    });
});

require __DIR__.'/settings.php';
