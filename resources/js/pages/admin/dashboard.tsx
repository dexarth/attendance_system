import { Head, Link } from '@inertiajs/react';
import { Users, ShieldCheck, UserCheck, Clock, UserX, CalendarClock, ArrowRight, LayoutDashboard } from 'lucide-react';
import AdminAttendanceController from '@/actions/App/Http/Controllers/Admin/AttendanceController';
import AdminDashboardController from '@/actions/App/Http/Controllers/Admin/DashboardController';
import UserManagementController from '@/actions/App/Http/Controllers/Admin/UserManagementController';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type StatCardProps = {
    label: string;
    value: number;
    icon: React.ReactNode;
    colorClass?: string;
    description?: string;
};

function StatCard({ label, value, icon, colorClass = 'text-foreground', description }: StatCardProps) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle>
                <div className={`rounded-md bg-muted p-2 ${colorClass}`}>{icon}</div>
            </CardHeader>
            <CardContent>
                <p className={`text-3xl font-bold ${colorClass}`}>{value}</p>
                {description && <p className="mt-1 text-xs text-muted-foreground">{description}</p>}
            </CardContent>
        </Card>
    );
}

type QuickLinkCardProps = {
    label: string;
    description: string;
    href: string;
    icon: React.ReactNode;
};

function QuickLinkCard({ label, description, href, icon }: QuickLinkCardProps) {
    return (
        <Link href={href} className="block">
            <Card className="h-full transition-colors hover:bg-accent/50">
                <CardHeader className="flex flex-row items-center gap-3 space-y-0 pb-2">
                    <div className="rounded-md bg-muted p-2 text-muted-foreground">{icon}</div>
                    <CardTitle className="text-sm font-semibold">{label}</CardTitle>
                </CardHeader>
                <CardContent className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">{description}</p>
                    <ArrowRight className="size-4 shrink-0 text-muted-foreground" />
                </CardContent>
            </Card>
        </Link>
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
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-semibold tracking-tight">Admin Dashboard</h2>
                        <p className="text-sm text-muted-foreground">Welcome back, Administrator</p>
                    </div>
                    <Badge variant="destructive" className="gap-1.5">
                        <ShieldCheck className="size-3.5" />
                        Admin
                    </Badge>
                </div>

                {/* Users overview */}
                <section>
                    <h3 className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                        Users Overview
                    </h3>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        <StatCard
                            label="Total Users"
                            value={totalUsers}
                            icon={<Users className="size-4" />}
                            description="All registered users"
                        />
                        <StatCard
                            label="Total Admins"
                            value={totalAdmins}
                            icon={<ShieldCheck className="size-4" />}
                            description="Administrator accounts"
                        />
                        <QuickLinkCard
                            label="Manage Users"
                            description="View and manage all user accounts"
                            href={UserManagementController.index.url()}
                            icon={<Users className="size-4" />}
                        />
                    </div>
                </section>

                {/* Today's attendance */}
                <section>
                    <h3 className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                        Today's Attendance
                    </h3>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        <StatCard
                            label="Present"
                            value={todayPresent}
                            icon={<UserCheck className="size-4" />}
                            colorClass="text-green-600 dark:text-green-400"
                            description="On time today"
                        />
                        <StatCard
                            label="Late"
                            value={todayLate}
                            icon={<Clock className="size-4" />}
                            colorClass="text-yellow-600 dark:text-yellow-400"
                            description="Arrived late"
                        />
                        <StatCard
                            label="Absent"
                            value={todayAbsent}
                            icon={<UserX className="size-4" />}
                            colorClass="text-red-600 dark:text-red-400"
                            description="Not checked in"
                        />
                        <StatCard
                            label="Half Day"
                            value={todayHalfDay}
                            icon={<CalendarClock className="size-4" />}
                            colorClass="text-blue-600 dark:text-blue-400"
                            description="Partial attendance"
                        />
                    </div>
                </section>

                {/* Quick actions */}
                <section>
                    <h3 className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                        Quick Actions
                    </h3>
                    <div className="grid gap-4 sm:grid-cols-2">
                        <QuickLinkCard
                            label="Attendance Records"
                            description="Browse and manage all attendance logs"
                            href={AdminAttendanceController.index.url()}
                            icon={<LayoutDashboard className="size-4" />}
                        />
                        <QuickLinkCard
                            label="User Management"
                            description="Add, edit, or deactivate user accounts"
                            href={UserManagementController.index.url()}
                            icon={<Users className="size-4" />}
                        />
                    </div>
                </section>
            </div>
        </>
    );
}

AdminDashboard.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: AdminDashboardController.index.url() },
    ],
};
