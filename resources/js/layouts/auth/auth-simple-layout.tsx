import { Link } from '@inertiajs/react';
import { home } from '@/routes';
import type { AuthLayoutProps } from '@/types';

export default function AuthSimpleLayout({
    children,
    title,
    description,
}: AuthLayoutProps) {
    return (
        <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-background p-6 md:p-10">
            <div className="w-full max-w-sm">
                <div className="flex flex-col gap-8">
                    <div className="flex flex-col items-center gap-0">
                        <Link href={home()}>
                            <img
                                src="/codevtech.png"
                                alt="CODEVTECH"
                                className="h-50 w-auto [filter:drop-shadow(0_1px_4px_rgba(0,0,0,0.35))]"
                            />
                        </Link>

                        <div className="space-y-2 text-center">
                            <h1 className="text-xl font-medium">{title}</h1>
                        </div>
                    </div>
                    {children}
                </div>
            </div>
        </div>
    );
}
