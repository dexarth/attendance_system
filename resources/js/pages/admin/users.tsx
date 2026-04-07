import { Head, useForm } from '@inertiajs/react';
import { formatDate } from '@/lib/utils';
import AdminDashboardController from '@/actions/App/Http/Controllers/Admin/DashboardController';
import UserManagementController from '@/actions/App/Http/Controllers/Admin/UserManagementController';
import { Button } from '@/components/ui/button';

type User = {
    id: number;
    name: string;
    email: string;
    role: 'admin' | 'user';
    created_at: string;
};

function RoleForm({ user }: { user: User }) {
    const { data, setData, patch, processing } = useForm({ role: user.role });

    function submit(e: React.FormEvent) {
        e.preventDefault();
        patch(UserManagementController.updateRole.url(user.id));
    }

    return (
        <form onSubmit={submit} className="flex items-center gap-2">
            <select
                value={data.role}
                onChange={(e) => setData('role', e.target.value as 'admin' | 'user')}
                className="rounded-md border border-input bg-background px-3 py-1.5 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
            >
                <option value="user">User</option>
                <option value="admin">Admin</option>
            </select>
            <Button type="submit" size="sm" disabled={processing || data.role === user.role}>
                Save
            </Button>
        </form>
    );
}

export default function Users({ users }: { users: User[] }) {
    return (
        <>
            <Head title="User Management" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div>
                    <h2 className="text-2xl font-semibold tracking-tight">User Management</h2>
                    <p className="text-sm text-muted-foreground">Manage user roles across the system</p>
                </div>

                <div className="overflow-x-auto rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                    <table className="w-full min-w-[540px] text-sm">
                        <thead>
                            <tr className="border-b border-sidebar-border/70 dark:border-sidebar-border">
                                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Name</th>
                                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Email</th>
                                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Joined</th>
                                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Role</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr
                                    key={user.id}
                                    className="border-b border-sidebar-border/70 last:border-0 dark:border-sidebar-border"
                                >
                                    <td className="px-4 py-3 font-medium">{user.name}</td>
                                    <td className="px-4 py-3 text-muted-foreground">{user.email}</td>
                                    <td className="px-4 py-3 text-muted-foreground">
                                        {formatDate(user.created_at)}
                                    </td>
                                    <td className="px-4 py-3">
                                        <RoleForm user={user} />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}

Users.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: AdminDashboardController.index.url(),
        },
        {
            title: 'User Management',
            href: UserManagementController.index.url(),
        },
    ],
};
