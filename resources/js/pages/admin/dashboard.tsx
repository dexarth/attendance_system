import { Head, Link } from '@inertiajs/react';
import AdminAttendanceController from '@/actions/App/Http/Controllers/Admin/AttendanceController';
import AdminDashboardController from '@/actions/App/Http/Controllers/Admin/DashboardController';
import UserManagementController from '@/actions/App/Http/Controllers/Admin/UserManagementController';

type StatCardProps = {
    label: string;
    value: number;
    color: string;
};

function StatCard({ label, value, color }: StatCardProps) {
    return (
        <div className="rounded-xl border border-sidebar-border/70 bg-card p-6 dark:border-sidebar-border">
            <p className="text-sm font-medium text-muted-foreground">{label}</p>
            <p className={`mt-2 text-4xl font-bold ${color}`}>{value}</p>
        </div>
    );
}

export default function AdminDashboard({
    totalUsers,
    totalAdmins,
    todayPresent,
    todayLate,
    todayAbsent,
    todayHalfDay,
}: {
    totalUsers: number;
    totalAdmins: number;
    todayPresent: number;
    todayLate: number;
    todayAbsent: number;
    todayHalfDay: number;
}) {
    return (
        <>
            <Head title="Admin Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-semibold tracking-tight">Admin Dashboard</h2>
                        <p className="text-sm text-muted-foreground">Welcome back, Administrator</p>
                    </div>
                    <span className="inline-flex items-center rounded-full bg-red-100 px-3 py-1 text-sm font-medium text-red-700 dark:bg-red-900/30 dark:text-red-400">
                        Admin
                    </span>
                </div>

                {/* Users summary */}
                <div>
                    <h3 className="mb-3 text-sm font-medium text-muted-foreground uppercase tracking-wide">Users</h3>
                    <div className="grid gap-4 md:grid-cols-3">
                        <StatCard label="Total Users" value={totalUsers} color="" />
                        <StatCard label="Total Admins" value={totalAdmins} color="" />
                        <div className="rounded-xl border border-sidebar-border/70 bg-card p-6 dark:border-sidebar-border">
                            <p className="text-sm font-medium text-muted-foreground">Manage Users</p>
                            <Link
                                href={UserManagementController.index.url()}
                                className="mt-3 inline-flex items-center text-sm font-medium text-primary underline-offset-4 hover:underline"
                            >
                                View all users →
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Today's attendance */}
                <div>
                    <h3 className="mb-3 text-sm font-medium text-muted-foreground uppercase tracking-wide">Today's Attendance</h3>
                    <div className="grid gap-4 md:grid-cols-4">
                        <StatCard label="Present" value={todayPresent} color="text-green-600 dark:text-green-400" />
                        <StatCard label="Late" value={todayLate} color="text-yellow-600 dark:text-yellow-400" />
                        <StatCard label="Absent" value={todayAbsent} color="text-red-600 dark:text-red-400" />
                        <StatCard label="Half Day" value={todayHalfDay} color="text-blue-600 dark:text-blue-400" />
                    </div>
                </div>

                {/* Quick links */}
                <div className="rounded-xl border border-sidebar-border/70 bg-card p-6 dark:border-sidebar-border">
                    <p className="text-sm font-medium text-muted-foreground">Attendance Records</p>
                    <Link
                        href={AdminAttendanceController.index.url()}
                        className="mt-3 inline-flex items-center text-sm font-medium text-primary underline-offset-4 hover:underline"
                    >
                        View all attendance →
                    </Link>
                </div>
            </div>
        </>
    );
}

AdminDashboard.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: AdminDashboardController.index.url() },
    ],
};
