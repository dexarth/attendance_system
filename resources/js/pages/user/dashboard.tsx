import { useState } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { toast } from 'sonner';
import { formatDate, utcTimeToMyt } from '@/lib/utils';
import UserAttendanceController from '@/actions/App/Http/Controllers/User/AttendanceController';
import UserDashboardController from '@/actions/App/Http/Controllers/User/DashboardController';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import type { Auth } from '@/types';

type Attendance = {
    id: number;
    date: string;
    check_in: string | null;
    check_out: string | null;
    status: 'present' | 'absent' | 'late' | 'half_day';
    remarks: string | null;
};

const STATUS_LABELS: Record<string, string> = {
    present: 'Present',
    late: 'Late',
    absent: 'Absent',
    half_day: 'Half Day',
};

const STATUS_CLASSES: Record<string, string> = {
    present: 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400',
    late: 'bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400',
    absent: 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400',
    half_day: 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400',
};

export default function UserDashboard({
    today,
    currentDate,
}: {
    today: Attendance | null;
    currentDate: string;
}) {
    const { auth } = usePage<{ auth: Auth }>().props;

    const [geoLoading, setGeoLoading] = useState(false);

    const checkedIn = !!today?.check_in;
    const checkedOut = !!today?.check_out;

    function withGeolocation(onSuccess: (lat: number, lon: number) => void) {
        if (!navigator.geolocation) {
            toast.error('Geolocation is not supported by your browser.');
            return;
        }

        setGeoLoading(true);

        navigator.geolocation.getCurrentPosition(
            (position) => {
                setGeoLoading(false);
                onSuccess(position.coords.latitude, position.coords.longitude);
            },
            (error) => {
                setGeoLoading(false);
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        toast.error('Location access was denied. Please enable location permissions and try again.');
                        break;
                    case error.POSITION_UNAVAILABLE:
                        toast.error('Your location could not be determined. Please try again.');
                        break;
                    case error.TIMEOUT:
                        toast.error('Location request timed out. Please try again.');
                        break;
                    default:
                        toast.error('An unknown location error occurred.');
                }
            },
            { timeout: 10000, maximumAge: 0, enableHighAccuracy: true },
        );
    }

    function handleCheckIn() {
        withGeolocation((lat, lon) => {
            router.post(UserAttendanceController.checkIn.url(), { latitude: lat, longitude: lon });
        });
    }

    function handleCheckOut() {
        withGeolocation((lat, lon) => {
            router.patch(UserAttendanceController.checkOut.url(), { latitude: lat, longitude: lon });
        });
    }

    return (
        <>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-semibold tracking-tight">Dashboard</h2>
                        <p className="text-sm text-muted-foreground">Welcome back, {auth.user.name}!</p>
                    </div>
                    <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                        User
                    </span>
                </div>

                {/* Today's attendance card */}
                <div className="rounded-xl border border-sidebar-border/70 p-6 dark:border-sidebar-border">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Today's Attendance</p>
                            <p className="text-xs text-muted-foreground">{formatDate(currentDate)}</p>
                        </div>
                        {today && (
                            <Badge className={STATUS_CLASSES[today.status]}>
                                {STATUS_LABELS[today.status]}
                            </Badge>
                        )}
                    </div>

                    {!today ? (
                        <div className="mt-4">
                            <p className="text-sm text-muted-foreground">You haven't checked in today.</p>
                            <Button className="mt-3" onClick={handleCheckIn} disabled={geoLoading}>
                                {geoLoading ? (
                                    <>
                                        <Spinner className="mr-2 size-4" />
                                        Getting Location...
                                    </>
                                ) : (
                                    'Check In'
                                )}
                            </Button>
                        </div>
                    ) : (
                        <div className="mt-4 space-y-3">
                            <div className="flex gap-6 text-sm">
                                <div>
                                    <span className="text-muted-foreground">Check In: </span>
                                    <span className="font-semibold">{utcTimeToMyt(today.check_in) ?? '—'}</span>
                                </div>
                                <div>
                                    <span className="text-muted-foreground">Check Out: </span>
                                    <span className="font-semibold">{utcTimeToMyt(today.check_out) ?? '—'}</span>
                                </div>
                            </div>

                            {!checkedOut && (
                                <Button variant="outline" size="sm" onClick={handleCheckOut} disabled={geoLoading}>
                                    {geoLoading ? (
                                        <>
                                            <Spinner className="mr-2 size-4" />
                                            Getting Location...
                                        </>
                                    ) : (
                                        'Check Out'
                                    )}
                                </Button>
                            )}

                            {checkedOut && (
                                <p className="text-sm text-green-600 dark:text-green-400">
                                    Attendance completed for today.
                                </p>
                            )}
                        </div>
                    )}
                </div>

                {/* Quick links */}
                <div className="grid gap-4 md:grid-cols-2">
                    <Link href={UserAttendanceController.today.url()} className="block">
                        <div className="rounded-xl border border-sidebar-border/70 p-6 transition-colors hover:bg-accent/50 dark:border-sidebar-border">
                            <p className="font-medium">Today's Attendance</p>
                            <p className="mt-1 text-sm text-muted-foreground">View detailed check-in/check-out status</p>
                        </div>
                    </Link>
                    <Link href={UserAttendanceController.index.url()} className="block">
                        <div className="rounded-xl border border-sidebar-border/70 p-6 transition-colors hover:bg-accent/50 dark:border-sidebar-border">
                            <p className="font-medium">Attendance History</p>
                            <p className="mt-1 text-sm text-muted-foreground">View your past attendance records</p>
                        </div>
                    </Link>
                </div>
            </div>
        </>
    );
}

UserDashboard.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: UserDashboardController.index.url() },
    ],
};
