<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Attendance;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Inertia\Inertia;
use Inertia\Response;

class AttendanceController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Attendance::with('user:id,name,email')
            ->orderBy('date', 'desc')
            ->orderBy('created_at', 'desc');

        if ($request->filled('date')) {
            $query->whereDate('date', $request->date);
        }

        if ($request->filled('user_id')) {
            $query->where('user_id', $request->user_id);
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        $attendances = $query->paginate(15)->withQueryString();

        $users = User::where('role', 'user')
            ->select('id', 'name')
            ->orderBy('name')
            ->get();

        return Inertia::render('admin/attendance/index', [
            'attendances' => $attendances,
            'users' => $users,
            'filters' => $request->only(['date', 'user_id', 'status']),
        ]);
    }

    public function create(): Response
    {
        $users = User::where('role', 'user')
            ->select('id', 'name')
            ->orderBy('name')
            ->get();

        return Inertia::render('admin/attendance/create', [
            'users' => $users,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'user_id'   => ['required', 'exists:users,id'],
            'date'      => ['required', 'date'],
            'check_in'  => ['nullable', 'date_format:H:i'],
            'check_out' => ['nullable', 'date_format:H:i', 'after:check_in'],
            'status'    => ['required', 'in:present,absent,late,half_day'],
            'remarks'   => ['nullable', 'string', 'max:500'],
        ]);

        Attendance::create([
            ...$validated,
            'check_in'  => $validated['check_in']
                ? Carbon::createFromFormat('H:i', $validated['check_in'], Attendance::MYT)->setTimezone('UTC')->format('H:i:s')
                : null,
            'check_out' => $validated['check_out']
                ? Carbon::createFromFormat('H:i', $validated['check_out'], Attendance::MYT)->setTimezone('UTC')->format('H:i:s')
                : null,
        ]);

        return to_route('admin.attendance.index')->with('success', 'Attendance record created.');
    }

    public function show(Attendance $attendance): Response
    {
        $attendance->load('user:id,name,email');

        $users = User::where('role', 'user')
            ->select('id', 'name')
            ->orderBy('name')
            ->get();

        return Inertia::render('admin/attendance/show', [
            'attendance' => $attendance,
            'users' => $users,
        ]);
    }

    public function update(Request $request, Attendance $attendance): RedirectResponse
    {
        $validated = $request->validate([
            'user_id'   => ['required', 'exists:users,id'],
            'date'      => ['required', 'date'],
            'check_in'  => ['nullable', 'date_format:H:i'],
            'check_out' => ['nullable', 'date_format:H:i', 'after:check_in'],
            'status'    => ['required', 'in:present,absent,late,half_day'],
            'remarks'   => ['nullable', 'string', 'max:500'],
        ]);

        $attendance->update([
            ...$validated,
            'check_in'  => $validated['check_in']
                ? Carbon::createFromFormat('H:i', $validated['check_in'], Attendance::MYT)->setTimezone('UTC')->format('H:i:s')
                : null,
            'check_out' => $validated['check_out']
                ? Carbon::createFromFormat('H:i', $validated['check_out'], Attendance::MYT)->setTimezone('UTC')->format('H:i:s')
                : null,
        ]);

        return back()->with('success', 'Attendance record updated.');
    }

    public function destroy(Attendance $attendance): RedirectResponse
    {
        $attendance->delete();

        return to_route('admin.attendance.index')->with('success', 'Attendance record deleted.');
    }
}
