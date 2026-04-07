<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\WorkSchedule;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class WorkScheduleController extends Controller
{
    public function edit(): Response
    {
        return Inertia::render('admin/settings', [
            'schedule' => WorkSchedule::current(),
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'work_start'            => ['required', 'date_format:H:i'],
            'work_end'              => ['required', 'date_format:H:i', 'after:work_start'],
            'office_latitude'       => ['nullable', 'numeric', 'between:-90,90'],
            'office_longitude'      => ['nullable', 'numeric', 'between:-180,180'],
            'allowed_radius_meters' => ['nullable', 'integer', 'min:10', 'max:5000'],
        ]);

        $schedule = WorkSchedule::current();
        $schedule->update([
            'work_start'            => $validated['work_start'].':00',
            'work_end'              => $validated['work_end'].':00',
            'office_latitude'       => $validated['office_latitude'] ?? null,
            'office_longitude'      => $validated['office_longitude'] ?? null,
            'allowed_radius_meters' => $validated['allowed_radius_meters'] ?? 100,
        ]);

        return back()->with('success', 'Settings saved.');
    }
}
