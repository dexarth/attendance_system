import { useEffect, useRef, useState } from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import { ClipboardList, History, LayoutGrid, LogOut, MoreHorizontal, Settings, Users, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { logout } from '@/routes';
import { edit as editProfile } from '@/routes/profile';
import type { Auth } from '@/types';

type NavItem = {
    title: string;
    href: string;
    icon: React.ElementType;
};

const adminNavItems: NavItem[] = [
    { title: 'Dashboard', href: '/admin/dashboard', icon: LayoutGrid },
    { title: 'Attendance', href: '/admin/attendance', icon: ClipboardList },
    { title: 'Users', href: '/admin/users', icon: Users },
    { title: 'Settings', href: '/admin/settings', icon: Settings },
];

const userNavItems: NavItem[] = [
    { title: 'Dashboard', href: '/user/dashboard', icon: LayoutGrid },
    { title: 'Today', href: '/user/attendance/today', icon: ClipboardList },
    { title: 'History', href: '/user/attendance', icon: History },
];

function getInitials(name: string): string {
    return name
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((word) => word[0].toUpperCase())
        .join('');
}

const MAX_DIRECT = 3;

export function BottomNav() {
    const page = usePage<{ auth: Auth }>();
    const { auth } = page.props;
    const currentPath = page.url.split('?')[0];
    const [moreOpen, setMoreOpen] = useState(false);
    const moreRef = useRef<HTMLDivElement>(null);

    const navItems = auth?.user?.role === 'admin' ? adminNavItems : userNavItems;
    const initials = getInitials(auth?.user?.name ?? '?');

    const visibleItems = navItems.slice(0, MAX_DIRECT);
    const overflowItems = navItems.slice(MAX_DIRECT);

    const isMoreActive = overflowItems.some(
        (item) => currentPath === item.href || currentPath.startsWith(item.href + '/'),
    );

    useEffect(() => {
        if (!moreOpen) return;
        function handleOutsideClick(e: MouseEvent) {
            if (moreRef.current && !moreRef.current.contains(e.target as Node)) {
                setMoreOpen(false);
            }
        }
        document.addEventListener('mousedown', handleOutsideClick);
        return () => document.removeEventListener('mousedown', handleOutsideClick);
    }, [moreOpen]);

    function handleLogout() {
        setMoreOpen(false);
        router.post(logout.url());
    }

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 flex h-16 items-center justify-around border-t border-sidebar-border bg-white shadow-lg md:hidden dark:bg-sidebar">
            {/* Direct nav items (max 3) */}
            {visibleItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentPath === item.href || currentPath.startsWith(item.href + '/');

                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                            'flex flex-1 flex-col items-center justify-center gap-1 py-2 text-xs font-medium transition-colors',
                            isActive
                                ? 'text-primary'
                                : 'text-muted-foreground hover:text-foreground',
                        )}
                    >
                        <Icon className={cn('size-5', isActive && 'stroke-[2.5]')} />
                        <span>{item.title}</span>
                    </Link>
                );
            })}

            {/* More button — contains overflow nav items + account options */}
            <div ref={moreRef} className="relative flex flex-1 flex-col items-center justify-center">
                <button
                    onClick={() => setMoreOpen((prev) => !prev)}
                    className={cn(
                        'flex flex-col items-center justify-center gap-1 py-2 text-xs font-medium transition-colors',
                        moreOpen || isMoreActive
                            ? 'text-primary'
                            : 'text-muted-foreground hover:text-foreground',
                    )}
                >
                    <MoreHorizontal className={cn('size-5', (moreOpen || isMoreActive) && 'stroke-[2.5]')} />
                    <span>More</span>
                </button>

                {moreOpen && (
                    <div className="absolute bottom-full mb-2 right-0 w-52 rounded-xl border border-sidebar-border bg-white py-1 shadow-lg dark:bg-sidebar">
                        {/* User info */}
                        <div className="flex items-center gap-3 border-b border-sidebar-border px-4 py-3">
                            <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                                {initials}
                            </span>
                            <div className="min-w-0">
                                <p className="truncate text-sm font-medium">{auth.user.name}</p>
                                <p className="truncate text-xs text-muted-foreground">{auth.user.email}</p>
                            </div>
                        </div>

                        {/* Overflow nav items */}
                        {overflowItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = currentPath === item.href || currentPath.startsWith(item.href + '/');
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setMoreOpen(false)}
                                    className={cn(
                                        'flex items-center gap-3 px-4 py-2.5 text-sm transition-colors hover:bg-accent',
                                        isActive ? 'text-primary font-medium' : 'text-foreground',
                                    )}
                                >
                                    <Icon className="size-4 text-muted-foreground" />
                                    {item.title}
                                </Link>
                            );
                        })}

                        {/* Account options */}
                        <div className="border-t border-sidebar-border mt-1 pt-1">
                            <Link
                                href={editProfile()}
                                onClick={() => setMoreOpen(false)}
                                className="flex items-center gap-3 px-4 py-2.5 text-sm text-foreground transition-colors hover:bg-accent"
                            >
                                <User className="size-4 text-muted-foreground" />
                                Profile
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-destructive transition-colors hover:bg-destructive/10"
                            >
                                <LogOut className="size-4" />
                                Log Out
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
}
