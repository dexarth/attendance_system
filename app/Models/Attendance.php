<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

class Attendance extends Model
{
    use HasFactory;

    /**
     * All attendance business logic (late check-in, daily boundaries) is
     * evaluated in Malaysia time. The time columns (check_in, check_out)
     * are stored as UTC strings; use MYT for every comparison or display.
     */
    const MYT = 'Asia/Kuala_Lumpur';

    protected $fillable = [
        'user_id',
        'date',
        'check_in',
        'check_out',
        'status',
        'remarks',
        'check_in_latitude',
        'check_in_longitude',
    ];

    protected function casts(): array
    {
        return [
            'date'               => 'date',
            'check_in_latitude'  => 'float',
            'check_in_longitude' => 'float',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Scope to today's records using Malaysia date, not UTC date.
     * Without this, records created after 16:00 UTC (00:00 MYT next day)
     * would be counted on the wrong day.
     */
    public function scopeToday($query)
    {
        return $query->whereDate('date', Carbon::today(self::MYT));
    }

    public function scopeForDate($query, string $date)
    {
        return $query->whereDate('date', $date);
    }

    public function scopeForUser($query, int $userId)
    {
        return $query->where('user_id', $userId);
    }

    /**
     * Determine attendance status from a UTC check-in time string.
     *
     * The check_in column stores UTC time (e.g. "06:00:00" for 14:00 MYT).
     * work_start is configured in Malaysia time (e.g. "09:00:00" MYT).
     * We must convert the UTC check-in to MYT before comparing — otherwise
     * a 14:00 MYT check-in would be compared as 06:00 UTC against a 09:00
     * threshold and incorrectly marked as "present".
     */
    public static function resolveStatus(string $checkInUtc): string
    {
        // Convert stored UTC time to Malaysia time for evaluation
        $checkInMyt = Carbon::createFromFormat('H:i:s', $checkInUtc, 'UTC')
            ->setTimezone(self::MYT);

        // work_start is stored as a Malaysia-time string (e.g. "09:00:00")
        $workStart = WorkSchedule::current()->work_start;
        [$h, $m] = array_pad(explode(':', $workStart), 2, '0');

        // Anchor both times to the same reference date so Carbon can compare them
        $today       = Carbon::today(self::MYT);
        $checkInTime = $today->copy()->setTime($checkInMyt->hour, $checkInMyt->minute, $checkInMyt->second);
        $threshold   = $today->copy()->setTime((int) $h, (int) $m, 0);

        return $checkInTime->lte($threshold) ? 'present' : 'late';
    }
}
