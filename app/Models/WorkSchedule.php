<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class WorkSchedule extends Model
{
    private const EARTH_RADIUS_METERS = 6_371_000;

    protected $fillable = [
        'work_start',
        'work_end',
        'office_latitude',
        'office_longitude',
        'allowed_radius_meters',
    ];

    protected function casts(): array
    {
        return [
            'office_latitude'       => 'float',
            'office_longitude'      => 'float',
            'allowed_radius_meters' => 'integer',
        ];
    }

    public static function current(): self
    {
        return static::firstOrCreate([], [
            'work_start' => '09:00:00',
            'work_end'   => '18:00:00',
        ]);
    }

    public static function haversineDistance(
        float $lat1, float $lon1,
        float $lat2, float $lon2
    ): float {
        $dLat = deg2rad($lat2 - $lat1);
        $dLon = deg2rad($lon2 - $lon1);

        $a = sin($dLat / 2) ** 2
            + cos(deg2rad($lat1)) * cos(deg2rad($lat2)) * sin($dLon / 2) ** 2;

        $c = 2 * atan2(sqrt($a), sqrt(1 - $a));

        return self::EARTH_RADIUS_METERS * $c;
    }

    public function isWithinRadius(float $userLat, float $userLon): bool
    {
        if ($this->office_latitude === null || $this->office_longitude === null) {
            return true;
        }

        $distance = self::haversineDistance(
            $this->office_latitude,
            $this->office_longitude,
            $userLat,
            $userLon
        );

        return $distance <= $this->allowed_radius_meters;
    }
}
