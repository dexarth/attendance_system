import { useState } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { toast } from 'sonner';
import { MapPin, LogIn, LogOut, History, CalendarCheck, CheckCircle2, Clock } from 'lucide-react';
import { formatDate, utcTimeToMyt } from '@/lib/utils';
import UserAttendanceController from '@/actions/App/Http/Controllers/User/AttendanceController';
import UserDashboardController from '@/actions/App/Http/Controllers/User/DashboardController';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
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
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-semibold tracking-tight">Dashboard</h2>
                        <p className="text-sm text-muted-foreground">Welcome back, {auth.user.name}!</p>
                    </div>
                    <Badge className="gap-1.5 bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400">
                        <Clock className="size-3.5" />
                        User
                    </Badge>
                </div>

                {/* Today's attendance card */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0">
                        <div>
                            <CardTitle className="text-base">Today's Attendance</CardTitle>
                            <CardDescription>{formatDate(currentDate)}</CardDescription>
                        </div>
                        {today ? (
                            <Badge className={STATUS_CLASSES[today.status]}>
                                {STATUS_LABELS[today.status]}
                            </Badge>
                        ) : (
                            <Badge variant="outline" className="text-muted-foreground">
                                Not recorded
                            </Badge>
                        )}
                    </CardHeader>
                    <CardContent>
                        {!today ? (
                            <div className="flex flex-col gap-3">
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <MapPin className="size-4 shrink-0" />
                                    <span>Your location will be recorded when you check in.</span>
                                </div>
                                <div>
                                    <Button onClick={handleCheckIn} disabled={geoLoading} className="gap-2">
                                        {geoLoading ? (
                                            <>
                                                <Spinner className="size-4" />
                                                Getting Location...
                                            </>
                                        ) : (
                                            <>
                                                <LogIn className="size-4" />
                                                Check In
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {/* Time display */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="rounded-lg bg-muted/50 px-4 py-3">
                                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Check In</p>
                                        <p className="mt-1 text-lg font-semibold tabular-nums">
                                            {utcTimeToMyt(today.check_in) ?? '—'}
                                        </p>
                                    </div>
                                    <div className="rounded-lg bg-muted/50 px-4 py-3">
                                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Check Out</p>
                                        <p className="mt-1 text-lg font-semibold tabular-nums">
                                            {utcTimeToMyt(today.check_out) ?? '—'}
                                        </p>
                                    </div>
                                </div>

                                {/* Action or completion */}
                                {!checkedOut ? (
                                    <div className="flex items-center gap-3">
                                        <Button variant="outline" size="sm" onClick={handleCheckOut} disabled={geoLoading} className="gap-2">
                                            {geoLoading ? (
                                                <>
                                                    <Spinner className="size-4" />
                                                    Getting Location...
                                                </>
                                            ) : (
                                                <>
                                                    <LogOut className="size-4" />
                                                    Check Out
                                                </>
                                            )}
                                        </Button>
                                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                            <MapPin className="size-3.5" />
                                            Location required
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400 font-medium">
                                        <CheckCircle2 className="size-4" />
                                        Attendance completed for today.
                                    </div>
                                )}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Quick links */}
                <section>
                    <h3 className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                        Quick Links
                    </h3>
                    <div className="grid gap-4 sm:grid-cols-2">
                        <Link href={UserAttendanceController.today.url()} className="block">
                            <Card className="h-full transition-colors hover:bg-accent/50">
                                <CardHeader className="flex flex-row items-center gap-3 space-y-0 pb-2">
                                    <div className="rounded-md bg-muted p-2 text-muted-foreground">
                                        <CalendarCheck className="size-4" />
                                    </div>
                                    <CardTitle className="text-sm font-semibold">Today's Attendance</CardTitle>
                                </CardHeader>
                                <CardContent className="flex items-center justify-between">
                                    <p className="text-sm text-muted-foreground">View detailed check-in/check-out status</p>
                                    <LogIn className="size-4 shrink-0 text-muted-foreground" />
                                </CardContent>
                            </Card>
                        </Link>
                        <Link href={UserAttendanceController.index.url()} className="block">
                            <Card className="h-full transition-colors hover:bg-accent/50">
                                <CardHeader className="flex flex-row items-center gap-3 space-y-0 pb-2">
                                    <div className="rounded-md bg-muted p-2 text-muted-foreground">
                                        <History className="size-4" />
                                    </div>
                                    <CardTitle className="text-sm font-semibold">Attendance History</CardTitle>
                                </CardHeader>
                                <CardContent className="flex items-center justify-between">
                                    <p className="text-sm text-muted-foreground">View your past attendance records</p>
                                    <History className="size-4 shrink-0 text-muted-foreground" />
                                </CardContent>
                            </Card>
                        </Link>
                    </div>
                </section>
            </div>
        </>
    );
}

UserDashboard.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: UserDashboardController.index.url() },
    ],
};
