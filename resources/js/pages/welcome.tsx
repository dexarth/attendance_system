import { Head, Link, usePage } from '@inertiajs/react';
import { ClipboardCheck, MapPin, BarChart3, ShieldCheck, ArrowRight } from 'lucide-react';
import { dashboard, login, register } from '@/routes';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

const FEATURES = [
    {
        icon: <ClipboardCheck className="size-5" />,
        title: 'Easy Check-In & Check-Out',
        description: 'Log attendance with a single tap. Records are timestamped and stored instantly.',
    },
    {
        icon: <MapPin className="size-5" />,
        title: 'Location Verification',
        description: 'GPS-based check-ins ensure attendance is recorded from the right location.',
    },
    {
        icon: <BarChart3 className="size-5" />,
        title: 'Attendance Analytics',
        description: 'Admins get a real-time overview of present, late, absent, and half-day records.',
    },
    {
        icon: <ShieldCheck className="size-5" />,
        title: 'Role-Based Access',
        description: 'Separate dashboards for admins and users keep data organized and secure.',
    },
];

export default function Welcome({ canRegister = true }: { canRegister?: boolean }) {
    const { auth } = usePage().props;

    return (
        <>
            <Head title="Welcome" />
            <div className="flex min-h-screen flex-col bg-background text-foreground">
                {/* Navbar */}
                <header className="sticky top-0 z-10 border-b border-border bg-background/80 backdrop-blur">
                    <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-6">
                        <div className="rounded-lg bg-gray-900 px-3 py-1.5">
                            <img src="/codevtech.png" alt="CODEVTECH" className="h-6 w-auto" />
                        </div>
                        <nav className="flex items-center gap-3">
                            {auth.user ? (
                                <Button asChild size="sm">
                                    <Link href={dashboard()}>
                                        Dashboard
                                        <ArrowRight className="ml-1.5 size-3.5" />
                                    </Link>
                                </Button>
                            ) : (
                                <>
                                    <Button asChild variant="ghost" size="sm">
                                        <Link href={login()}>Log in</Link>
                                    </Button>
                                    {canRegister && (
                                        <Button asChild size="sm">
                                            <Link href={register()}>Get started</Link>
                                        </Button>
                                    )}
                                </>
                            )}
                        </nav>
                    </div>
                </header>

                <main className="flex flex-1 flex-col">
                    {/* Hero */}
                    <section className="mx-auto flex w-full max-w-5xl flex-col items-center gap-6 px-6 py-20 text-center md:py-32">
                        <Badge variant="secondary" className="gap-1.5">
                            <ClipboardCheck className="size-3.5" />
                            Attendance tracking made simple
                        </Badge>
                        <h1 className="max-w-2xl text-4xl font-bold tracking-tight md:text-5xl">
                            Track attendance,{' '}
                            <span className="text-primary">effortlessly.</span>
                        </h1>
                        <p className="max-w-lg text-lg text-muted-foreground">
                            A modern attendance management system with GPS verification, real-time dashboards, and role-based access for teams of any size.
                        </p>
                        <div className="flex flex-wrap items-center justify-center gap-3">
                            {auth.user ? (
                                <Button asChild size="lg">
                                    <Link href={dashboard()}>
                                        Go to Dashboard
                                        <ArrowRight className="ml-2 size-4" />
                                    </Link>
                                </Button>
                            ) : (
                                <>
                                    {canRegister && (
                                        <Button asChild size="lg">
                                            <Link href={register()}>
                                                Get started free
                                                <ArrowRight className="ml-2 size-4" />
                                            </Link>
                                        </Button>
                                    )}
                                    <Button asChild variant="outline" size="lg">
                                        <Link href={login()}>Log in</Link>
                                    </Button>
                                </>
                            )}
                        </div>
                    </section>

                    {/* Features */}
                    <section className="mx-auto w-full max-w-5xl px-6 pb-20">
                        <div className="mb-10 text-center">
                            <h2 className="text-2xl font-semibold tracking-tight">Everything you need</h2>
                            <p className="mt-2 text-muted-foreground">Built for organizations that need reliable, verifiable attendance data.</p>
                        </div>
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                            {FEATURES.map((feature) => (
                                <Card key={feature.title}>
                                    <CardHeader className="pb-2">
                                        <div className="mb-2 w-fit rounded-md bg-muted p-2 text-primary">
                                            {feature.icon}
                                        </div>
                                        <CardTitle className="text-sm font-semibold">{feature.title}</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <CardDescription>{feature.description}</CardDescription>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </section>

                    {/* CTA */}
                    {!auth.user && (
                        <section className="border-t border-border bg-muted/40">
                            <div className="mx-auto flex max-w-5xl flex-col items-center gap-4 px-6 py-16 text-center">
                                <h2 className="text-2xl font-semibold tracking-tight">Ready to get started?</h2>
                                <p className="text-muted-foreground">Sign up in seconds and start tracking attendance today.</p>
                                <div className="flex flex-wrap gap-3">
                                    {canRegister && (
                                        <Button asChild size="lg">
                                            <Link href={register()}>
                                                Create an account
                                                <ArrowRight className="ml-2 size-4" />
                                            </Link>
                                        </Button>
                                    )}
                                    <Button asChild variant="outline" size="lg">
                                        <Link href={login()}>Log in</Link>
                                    </Button>
                                </div>
                            </div>
                        </section>
                    )}
                </main>

                <footer className="border-t border-border py-6 text-center text-xs text-muted-foreground">
                    &copy; {new Date().getFullYear()} Attendance System. All rights reserved.
                </footer>
            </div>
        </>
    );
}
