<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Attendance;
use App\Models\User;
use Illuminate\Support\Carbon;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        $today = Carbon::today(Attendance::MYT);

        return Inertia::render('admin/dashboard', [
            'totalUsers'    => User::where('role', 'user')->count(),
            'totalAdmins'   => User::where('role', 'admin')->count(),
            'todayPresent'  => Attendance::whereDate('date', $today)->where('status', 'present')->count(),
            'todayLate'     => Attendance::whereDate('date', $today)->where('status', 'late')->count(),
            'todayAbsent'   => Attendance::whereDate('date', $today)->where('status', 'absent')->count(),
            'todayHalfDay'  => Attendance::whereDate('date', $today)->where('status', 'half_day')->count(),
        ]);
    }
}
