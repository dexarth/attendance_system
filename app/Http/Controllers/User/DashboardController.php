<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Attendance;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(Request $request): Response
    {
        $todayMyt = Carbon::today(Attendance::MYT)->toDateString();

        $today = $request->user()
            ->attendances()
            ->whereDate('date', $todayMyt)
            ->first();

        return Inertia::render('user/dashboard', [
            'today' => $today,
            'currentDate' => $todayMyt,
        ]);
    }
}
