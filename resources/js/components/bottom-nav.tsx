import { useEffect, useRef, useState } from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import { ClipboardList, History, LayoutGrid, LogOut, Settings, Users } from 'lucide-react';
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

export function BottomNav() {
    const { auth } = usePage<{ auth: Auth }>().props;
    const currentPath = window.location.pathname;
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    const navItems = auth?.user?.role === 'admin' ? adminNavItems : userNavItems;
    const initials = getInitials(auth?.user?.name ?? '?');

    // Close menu on outside click
    useEffect(() => {
        if (!menuOpen) return;
        function handleOutsideClick(e: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setMenuOpen(false);
            }
        }
        document.addEventListener('mousedown', handleOutsideClick);
        return () => document.removeEventListener('mousedown', handleOutsideClick);
    }, [menuOpen]);

    function handleLogout() {
        setMenuOpen(false);
        router.post(logout.url());
    }

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 flex h-16 items-center justify-around border-t border-sidebar-border bg-white shadow-lg md:hidden dark:bg-sidebar">
            {navItems.map((item) => {
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

            {/* User avatar button + popup */}
            <div ref={menuRef} className="relative flex flex-1 flex-col items-center justify-center">
                <button
                    onClick={() => setMenuOpen((prev) => !prev)}
                    className="flex flex-col items-center justify-center gap-1 py-2 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
                >
                    <span className={cn(
                        'flex size-7 items-center justify-center rounded-full text-xs font-semibold',
                        menuOpen
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted text-muted-foreground',
                    )}>
                        {initials}
                    </span>
                    <span>Account</span>
                </button>

                {/* Popup menu — slides up above the nav */}
                {menuOpen && (
                    <div className="absolute bottom-full mb-2 right-0 w-48 rounded-xl border border-sidebar-border bg-white py-1 shadow-lg dark:bg-sidebar">
                        <div className="border-b border-sidebar-border px-4 py-2.5">
                            <p className="truncate text-sm font-medium">{auth.user.name}</p>
                            <p className="truncate text-xs text-muted-foreground">{auth.user.email}</p>
                        </div>

                        <Link
                            href={editProfile()}
                            onClick={() => setMenuOpen(false)}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-foreground transition-colors hover:bg-accent"
                        >
                            <Settings className="size-4 text-muted-foreground" />
                            Settings
                        </Link>

                        <button
                            onClick={handleLogout}
                            className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-destructive transition-colors hover:bg-destructive/10"
                        >
                            <LogOut className="size-4" />
                            Log Out
                        </button>
                    </div>
                )}
            </div>
        </nav>
    );
}
