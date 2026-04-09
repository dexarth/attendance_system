import { Link } from '@inertiajs/react';
import { home } from '@/routes';
import type { AuthLayoutProps } from '@/types';

export default function AuthSplitLayout({
    children,
    title,
    description,
}: AuthLayoutProps) {
    return (
        <div className="relative grid h-dvh flex-col items-center justify-center px-8 sm:px-0 lg:max-w-none lg:grid-cols-2 lg:px-0">
            {/* Left panel */}
            <div className="relative hidden h-full flex-col bg-gray-900 p-10 text-white lg:flex">
                <Link href={home()} className="relative z-20">
                    <img
                        src="/codevtech.png"
                        alt="CODEVTECH"
                        className="h-12 w-auto"
                    />
                </Link>
                <div className="relative z-20 mt-auto">
                    <p className="text-lg font-medium leading-relaxed text-white/80">
                        Track attendance, verify locations, and manage your team — all in one place.
                    </p>
                </div>
            </div>

            {/* Right panel */}
            <div className="w-full lg:p-8">
                <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
                    {/* Mobile logo */}
                    <Link href={home()} className="flex justify-center lg:hidden">
                        <img
                            src="/codevtech.png"
                            alt="CODEVTECH"
                            className="h-14 w-auto [filter:drop-shadow(0_1px_4px_rgba(0,0,0,0.35))]"
                        />
                    </Link>
                    <div className="flex flex-col items-start gap-2 text-left sm:items-center sm:text-center">
                        <h1 className="text-xl font-medium">{title}</h1>
                        <p className="text-sm text-balance text-muted-foreground">
                            {description}
                        </p>
                    </div>
                    {children}
                </div>
            </div>
        </div>
    );
}
