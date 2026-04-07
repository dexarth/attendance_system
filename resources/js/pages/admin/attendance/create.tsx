import { Head, useForm } from '@inertiajs/react';
import AdminAttendanceController from '@/actions/App/Http/Controllers/Admin/AttendanceController';
import AdminDashboardController from '@/actions/App/Http/Controllers/Admin/DashboardController';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type User = { id: number; name: string };

export default function AttendanceCreate({ users }: { users: User[] }) {
    const { data, setData, post, processing, errors } = useForm({
        user_id: '',
        date: new Date().toISOString().slice(0, 10),
        check_in: '',
        check_out: '',
        status: 'present',
        remarks: '',
    });

    function submit(e: React.FormEvent) {
        e.preventDefault();
        post(AdminAttendanceController.store.url());
    }

    return (
        <>
            <Head title="Mark Attendance" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div>
                    <h2 className="text-2xl font-semibold tracking-tight">Mark Attendance</h2>
                    <p className="text-sm text-muted-foreground">Manually create an attendance record for a user</p>
                </div>

                <form onSubmit={submit} className="max-w-lg space-y-5 rounded-xl border border-sidebar-border/70 p-6 dark:border-sidebar-border">
                    <div className="grid gap-2">
                        <Label htmlFor="user_id">User</Label>
                        <select
                            id="user_id"
                            value={data.user_id}
                            onChange={(e) => setData('user_id', e.target.value)}
                            className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm shadow-xs focus:outline-none focus:ring-1 focus:ring-ring"
                            required
                        >
                            <option value="">Select a user</option>
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
                            placeholder="Any notes..."
                        />
                        <InputError message={errors.remarks} />
                    </div>

                    <div className="flex gap-3">
                        <Button type="submit" disabled={processing}>Save Record</Button>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => history.back()}
                        >
                            Cancel
                        </Button>
                    </div>
                </form>
            </div>
        </>
    );
}

AttendanceCreate.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: AdminDashboardController.index.url() },
        { title: 'Attendance', href: AdminAttendanceController.index.url() },
        { title: 'Mark Attendance', href: AdminAttendanceController.create.url() },
    ],
};
