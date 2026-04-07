import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { formatDate, utcTimeToMyt } from '@/lib/utils';
import UserAttendanceController from '@/actions/App/Http/Controllers/User/AttendanceController';
import UserDashboardController from '@/actions/App/Http/Controllers/User/DashboardController';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

type Attendance = {
    id: number;
    date: string;
    check_in: string | null;
    check_out: string | null;
    status: 'present' | 'absent' | 'late' | 'half_day';
    remarks: string | null;
};

type PaginatedAttendances = {
    data: Attendance[];
    current_page: number;
    last_page: number;
    from: number;
    to: number;
    total: number;
    links: { url: string | null; label: string; active: boolean }[];
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

const MONTHS = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
];

export default function AttendanceHistory({
    attendances,
    filters,
}: {
    attendances: PaginatedAttendances;
    filters: { month?: string; year?: string };
}) {
    const currentYear = new Date().getFullYear();
    const [month, setMonth] = useState(filters.month ?? '');
    const [year, setYear] = useState(filters.year ?? String(currentYear));

    function applyFilters(e: React.FormEvent) {
        e.preventDefault();
        router.get(UserAttendanceController.index.url(), {
            month: month || undefined,
            year: year || undefined,
        }, { preserveState: true, replace: true });
    }

    function clearFilters() {
        setMonth('');
        setYear(String(currentYear));
        router.get(UserAttendanceController.index.url(), {}, { replace: true });
    }

    return (
        <>
            <Head title="Attendance History" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-semibold tracking-tight">Attendance History</h2>
                        <p className="text-sm text-muted-foreground">Your personal attendance records</p>
                    </div>
                    <Link href={UserAttendanceController.today.url()}>
                        <Button size="sm" variant="outline">Today's Attendance</Button>
                    </Link>
                </div>

                {/* Filters */}
                <form onSubmit={applyFilters} className="flex flex-wrap items-end gap-3 rounded-xl border border-sidebar-border/70 p-4 dark:border-sidebar-border">
                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-medium text-muted-foreground">Month</label>
                        <select
                            value={month}
                            onChange={(e) => setMonth(e.target.value)}
                            className="h-8 rounded-md border border-input bg-background px-3 text-sm shadow-xs focus:outline-none focus:ring-1 focus:ring-ring"
                        >
                            <option value="">All months</option>
                            {MONTHS.map((m, i) => (
                                <option key={i + 1} value={i + 1}>{m}</option>
                            ))}
                        </select>
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-medium text-muted-foreground">Year</label>
                        <select
                            value={year}
                            onChange={(e) => setYear(e.target.value)}
                            className="h-8 rounded-md border border-input bg-background px-3 text-sm shadow-xs focus:outline-none focus:ring-1 focus:ring-ring"
                        >
                            {[currentYear, currentYear - 1, currentYear - 2].map((y) => (
                                <option key={y} value={y}>{y}</option>
                            ))}
                        </select>
                    </div>
                    <div className="flex gap-2">
                        <Button type="submit" size="sm">Filter</Button>
                        <Button type="button" size="sm" variant="outline" onClick={clearFilters}>Clear</Button>
                    </div>
                </form>

                {/* Table */}
                <div className="overflow-x-auto rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                    <table className="w-full min-w-[540px] text-sm">
                        <thead>
                            <tr className="border-b border-sidebar-border/70 dark:border-sidebar-border">
                                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Date</th>
                                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Check In</th>
                                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Check Out</th>
                                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Status</th>
                                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Remarks</th>
                            </tr>
                        </thead>
                        <tbody>
                            {attendances.data.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                                        No attendance records found.
                                    </td>
                                </tr>
                            ) : (
                                attendances.data.map((record) => (
                                    <tr key={record.id} className="border-b border-sidebar-border/70 last:border-0 dark:border-sidebar-border">
                                        <td className="px-4 py-3 font-medium">{formatDate(record.date)}</td>
                                        <td className="px-4 py-3">{utcTimeToMyt(record.check_in) ?? '—'}</td>
                                        <td className="px-4 py-3">{utcTimeToMyt(record.check_out) ?? '—'}</td>
                                        <td className="px-4 py-3">
                                            <Badge className={STATUS_CLASSES[record.status]}>
                                                {STATUS_LABELS[record.status]}
                                            </Badge>
                                        </td>
                                        <td className="px-4 py-3 text-muted-foreground">{record.remarks ?? '—'}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {attendances.last_page > 1 && (
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>Showing {attendances.from}–{attendances.to} of {attendances.total}</span>
                        <div className="flex gap-1">
                            {attendances.links.map((link, i) => (
                                <Link
                                    key={i}
                                    href={link.url ?? '#'}
                                    className={[
                                        'rounded px-3 py-1',
                                        link.active ? 'bg-primary text-primary-foreground' : 'hover:bg-accent',
                                        !link.url ? 'pointer-events-none opacity-40' : '',
                                    ].join(' ')}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

AttendanceHistory.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: UserDashboardController.index.url() },
        { title: 'Attendance History', href: UserAttendanceController.index.url() },
    ],
};
