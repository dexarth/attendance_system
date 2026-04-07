import { Head, router, useForm } from '@inertiajs/react';
import { formatDate, utcTimeToMyt } from '@/lib/utils';
import { useState } from 'react';
import AdminAttendanceController from '@/actions/App/Http/Controllers/Admin/AttendanceController';
import AdminDashboardController from '@/actions/App/Http/Controllers/Admin/DashboardController';
import InputError from '@/components/input-error';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type User = { id: number; name: string };

type Attendance = {
    id: number;
    date: string;
    check_in: string | null;
    check_out: string | null;
    status: 'present' | 'absent' | 'late' | 'half_day';
    remarks: string | null;
    user: { id: number; name: string; email: string };
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

export default function AttendanceShow({
    attendance,
    users,
}: {
    attendance: Attendance;
    users: User[];
}) {
    const [confirmDelete, setConfirmDelete] = useState(false);

    const { data, setData, patch, processing, errors } = useForm({
        user_id: String(attendance.user.id),
        date: attendance.date,
        check_in: utcTimeToMyt(attendance.check_in) ?? '',
        check_out: utcTimeToMyt(attendance.check_out) ?? '',
        status: attendance.status,
        remarks: attendance.remarks ?? '',
    });

    function submitEdit(e: React.FormEvent) {
        e.preventDefault();
        patch(AdminAttendanceController.update.url(attendance.id));
    }

    function handleDelete() {
        router.delete(AdminAttendanceController.destroy.url(attendance.id));
    }

    return (
        <>
            <Head title={`Attendance — ${attendance.date}`} />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-4">
                <div className="flex items-start justify-between">
                    <div>
                        <h2 className="text-2xl font-semibold tracking-tight">Attendance Record</h2>
                        <p className="text-sm text-muted-foreground">
                            {attendance.user.name} · {formatDate(attendance.date)}
                        </p>
                    </div>
                    <Badge className={STATUS_CLASSES[attendance.status]}>
                        {STATUS_LABELS[attendance.status]}
                    </Badge>
                </div>

                {/* Edit Form */}
                <form onSubmit={submitEdit} className="max-w-lg space-y-5 rounded-xl border border-sidebar-border/70 p-6 dark:border-sidebar-border">
                    <h3 className="font-medium">Edit Record</h3>

                    <div className="grid gap-2">
                        <Label htmlFor="user_id">User</Label>
                        <select
                            id="user_id"
                            value={data.user_id}
                            onChange={(e) => setData('user_id', e.target.value)}
                            className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm shadow-xs focus:outline-none focus:ring-1 focus:ring-ring"
                            required
                        >
                            {users.map((u) => (
                                <option key={u.id} value={u.id}>{u.name}</option>
                            ))}
                        </select>
                        <InputError message={errors.user_id} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="date">Date</Label>
                        <Input
                            id="date"
                            type="date"
                            value={data.date}
                            onChange={(e) => setData('date', e.target.value)}
                            required
                        />
                        <InputError message={errors.date} />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="check_in">Check In</Label>
                            <Input
                                id="check_in"
                                type="time"
                                value={data.check_in}
                                onChange={(e) => setData('check_in', e.target.value)}
                            />
                            <InputError message={errors.check_in} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="check_out">Check Out</Label>
                            <Input
                                id="check_out"
                                type="time"
                                value={data.check_out}
                                onChange={(e) => setData('check_out', e.target.value)}
                            />
                            <InputError message={errors.check_out} />
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="status">Status</Label>
                        <select
                            id="status"
                            value={data.status}
                            onChange={(e) => setData('status', e.target.value)}
                            className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm shadow-xs focus:outline-none focus:ring-1 focus:ring-ring"
                            required
                        >
                            <option value="present">Present</option>
                            <option value="late">Late</option>
                            <option value="absent">Absent</option>
                            <option value="half_day">Half Day</option>
                        </select>
                        <InputError message={errors.status} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="remarks">Remarks <span className="text-muted-foreground">(optional)</span></Label>
                        <textarea
                            id="remarks"
                            value={data.remarks}
                            onChange={(e) => setData('remarks', e.target.value)}
                            rows={3}
                            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs focus:outline-none focus:ring-1 focus:ring-ring"
                        />
                        <InputError message={errors.remarks} />
                    </div>

                    <Button type="submit" disabled={processing}>Save Changes</Button>
                </form>

                {/* Delete */}
                <div className="max-w-lg rounded-xl border border-destructive/30 p-6">
                    <h3 className="font-medium text-destructive">Delete Record</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                        This action cannot be undone. The attendance record will be permanently deleted.
                    </p>
                    {!confirmDelete ? (
                        <Button
                            variant="destructive"
                            size="sm"
                            className="mt-4"
                            onClick={() => setConfirmDelete(true)}
                        >
                            Delete Record
                        </Button>
                    ) : (
                        <div className="mt-4 flex gap-3">
                            <Button variant="destructive" size="sm" onClick={handleDelete}>
                                Yes, delete it
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => setConfirmDelete(false)}>
                                Cancel
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

AttendanceShow.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: AdminDashboardController.index.url() },
        { title: 'Attendance', href: AdminAttendanceController.index.url() },
        { title: 'Record Detail', href: '#' },
    ],
};
