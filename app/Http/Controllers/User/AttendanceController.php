<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Attendance;
use App\Models\WorkSchedule;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Inertia\Inertia;
use Inertia\Response;

class AttendanceController extends Controller
{
    public function index(Request $request): Response
    {
        $query = $request->user()
            ->attendances()
            ->orderBy('date', 'desc');

        if ($request->filled('month') && $request->filled('year')) {
            $query->whereMonth('date', $request->month)
                  ->whereYear('date', $request->year);
        } elseif ($request->filled('year')) {
            $query->whereYear('date', $request->year);
        }

        $attendances = $query->paginate(15)->withQueryString();

        return Inertia::render('user/attendance/index', [
            'attendances' => $attendances,
            'filters' => $request->only(['month', 'year']),
        ]);
    }

    public function today(Request $request): Response
    {
        // Use Malaysia date — an employee working past midnight UTC should still
        // see today's record as their local (MYT) calendar date.
        $todayMyt = Carbon::today(Attendance::MYT)->toDateString();

        $today = $request->user()
            ->attendances()
            ->whereDate('date', $todayMyt)
            ->first();

        return Inertia::render('user/attendance/today', [
            'today'       => $today,
            // currentTime is shown in the UI — always display in Malaysia time
            'currentTime' => Carbon::now(Attendance::MYT)->format('H:i'),
            'currentDate' => $todayMyt,
        ]);
    }

    public function checkIn(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'latitude'  => ['required', 'numeric', 'between:-90,90'],
            'longitude' => ['required', 'numeric', 'between:-180,180'],
        ]);

        $schedule = WorkSchedule::current();

        if (! $schedule->isWithinRadius((float) $validated['latitude'], (float) $validated['longitude'])) {
            return back()->with('error', 'You are outside the allowed office radius. Please check in from the office.');
        }

        $user = $request->user();

        // Use Malaysia date so the attendance record belongs to the correct
        // local calendar day, regardless of the server's UTC clock.
        $todayMyt = Carbon::today(Attendance::MYT)->toDateString();

        $existing = $user->attendances()->whereDate('date', $todayMyt)->first();

        if ($existing) {
            return back()->with('error', 'You have already checked in today.');
        }

        // Store check_in as UTC in the database.
        // The frontend will convert UTC → MYT for display using utcTimeToMyt().
        $checkInUtc = Carbon::now('UTC')->format('H:i:s');

        // resolveStatus() receives UTC time and converts to MYT internally
        // before comparing against the configured work_start threshold.
        $status = Attendance::resolveStatus($checkInUtc);

        $user->attendances()->create([
            'date'               => $todayMyt,   // Malaysia calendar date
            'check_in'           => $checkInUtc, // UTC time — frontend adds +8 for display
            'status'             => $status,
            'check_in_latitude'  => $validated['latitude'],
            'check_in_longitude' => $validated['longitude'],
        ]);

        return to_route('user.attendance.today')->with('success', 'Checked in successfully.');
    }

    public function checkOut(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'latitude'  => ['required', 'numeric', 'between:-90,90'],
            'longitude' => ['required', 'numeric', 'between:-180,180'],
        ]);

        $schedule = WorkSchedule::current();

        if (! $schedule->isWithinRadius((float) $validated['latitude'], (float) $validated['longitude'])) {
            return back()->with('error', 'You are outside the allowed office radius. Please check out from the office.');
        }

        $user = $request->user();

        // Look up today's record using Malaysia date
        $todayMyt  = Carbon::today(Attendance::MYT)->toDateString();
        $attendance = $user->attendances()->whereDate('date', $todayMyt)->first();

        if (! $attendance) {
            return back()->with('error', 'You have not checked in today.');
        }

        if ($attendance->check_out) {
            return back()->with('error', 'You have already checked out today.');
        }

        // Store check_out as UTC; frontend displays as MYT
        $attendance->update([
            'check_out' => Carbon::now('UTC')->format('H:i:s'),
        ]);

        return to_route('user.attendance.today')->with('success', 'Checked out successfully.');
    }
}
