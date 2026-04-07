import { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import {
    AdvancedMarker,
    APIProvider,
    Map,
    MapMouseEvent,
} from '@vis.gl/react-google-maps';
import { Circle } from '@vis.gl/react-google-maps';
import AdminDashboardController from '@/actions/App/Http/Controllers/Admin/DashboardController';
import WorkScheduleController from '@/actions/App/Http/Controllers/Admin/WorkScheduleController';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';

type WorkSchedule = {
    id: number;
    work_start: string;
    work_end: string;
    office_latitude: number | null;
    office_longitude: number | null;
    allowed_radius_meters: number;
};

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string;
const DEFAULT_CENTER = { lat: 3.139, lng: 101.6869 };

export default function AdminSettings({ schedule }: { schedule: WorkSchedule }) {
    const { data, setData, patch, processing, errors } = useForm({
        work_start:            schedule.work_start.slice(0, 5),
        work_end:              schedule.work_end.slice(0, 5),
        office_latitude:       schedule.office_latitude,
        office_longitude:      schedule.office_longitude,
        allowed_radius_meters: schedule.allowed_radius_meters ?? 100,
    });

    const [locating, setLocating] = useState(false);
    const [locateError, setLocateError] = useState<string | null>(null);

    function submit(e: React.FormEvent) {
        e.preventDefault();
        patch(WorkScheduleController.update.url());
    }

    function handleMapClick(e: MapMouseEvent) {
        if (e.detail.latLng) {
            setData((prev) => ({
                ...prev,
                office_latitude:  e.detail.latLng!.lat,
                office_longitude: e.detail.latLng!.lng,
            }));
        }
    }

    function useMyLocation() {
        if (!navigator.geolocation) {
            setLocateError('Geolocation is not supported by your browser.');
            return;
        }
        setLocating(true);
        setLocateError(null);
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                setData((prev) => ({
                    ...prev,
                    office_latitude:  pos.coords.latitude,
                    office_longitude: pos.coords.longitude,
                }));
                setLocating(false);
            },
            () => {
                setLocateError('Could not get your location. Please click on the map to set the office pin manually.');
                setLocating(false);
            },
            { timeout: 10000, enableHighAccuracy: true },
        );
    }

    const hasPin = data.office_latitude !== null && data.office_longitude !== null;
    const mapCenter = hasPin
        ? { lat: data.office_latitude as number, lng: data.office_longitude as number }
        : DEFAULT_CENTER;

    return (
        <>
            <Head title="Admin Settings" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-4">
                <div>
                    <h2 className="text-2xl font-semibold tracking-tight">System Settings</h2>
                    <p className="text-sm text-muted-foreground">Configure attendance and working hour rules</p>
                </div>

                <form onSubmit={submit} className="space-y-6">
                    {/* Working Hours */}
                    <div className="max-w-md space-y-5 rounded-xl border border-sidebar-border/70 p-6 dark:border-sidebar-border">
                        <div>
                            <h3 className="font-medium">Working Hours</h3>
                            <p className="text-sm text-muted-foreground">
                                Set the start and end time for the working day. Check-ins after the start time will be marked as <strong>Late</strong>.
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="work_start">Work Start Time</Label>
                                <Input
                                    id="work_start"
                                    type="time"
                                    value={data.work_start}
                                    onChange={(e) => setData('work_start', e.target.value)}
                                    required
                                />
                                <InputError message={errors.work_start} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="work_end">Work End Time</Label>
                                <Input
                                    id="work_end"
                                    type="time"
                                    value={data.work_end}
                                    onChange={(e) => setData('work_end', e.target.value)}
                                    required
                                />
                                <InputError message={errors.work_end} />
                            </div>
                        </div>

                        <p className="text-xs text-muted-foreground">
                            Current: <strong>{schedule.work_start.slice(0, 5)}</strong> — <strong>{schedule.work_end.slice(0, 5)}</strong>
                        </p>
                    </div>

                    {/* Office Location */}
                    <div className="max-w-2xl space-y-4 rounded-xl border border-sidebar-border/70 p-6 dark:border-sidebar-border">
                        <div>
                            <h3 className="font-medium">Office Location</h3>
                            <p className="text-sm text-muted-foreground">
                                Click on the map to pin the office location, or drag the marker to adjust. The blue circle shows the allowed check-in zone.
                            </p>
                        </div>

                        {locateError && (
                            <p className="text-sm text-destructive">{locateError}</p>
                        )}

                        <APIProvider apiKey={GOOGLE_MAPS_API_KEY}>
                            <Map
                                mapId="office-location-map"
                                style={{ width: '100%', height: '400px', borderRadius: '0.75rem' }}
                                defaultCenter={mapCenter}
                                defaultZoom={hasPin ? 17 : 12}
                                onClick={handleMapClick}
                                gestureHandling="greedy"
                                disableDefaultUI={false}
                            >
                                {hasPin && (
                                    <>
                                        <AdvancedMarker
                                            position={{ lat: data.office_latitude as number, lng: data.office_longitude as number }}
                                            draggable
                                            onDragEnd={(e) => {
                                                if (e.latLng) {
                                                    setData((prev) => ({
                                                        ...prev,
                                                        office_latitude:  e.latLng!.lat(),
                                                        office_longitude: e.latLng!.lng(),
                                                    }));
                                                }
                                            }}
                                        />
                                        <Circle
                                            center={{ lat: data.office_latitude as number, lng: data.office_longitude as number }}
                                            radius={data.allowed_radius_meters}
                                            strokeColor="#3b82f6"
                                            strokeOpacity={0.8}
                                            strokeWeight={2}
                                            fillColor="#3b82f6"
                                            fillOpacity={0.15}
                                        />
                                    </>
                                )}
                            </Map>
                        </APIProvider>

                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={useMyLocation}
                            disabled={locating}
                        >
                            {locating ? (
                                <>
                                    <Spinner className="mr-2 size-4" />
                                    Detecting...
                                </>
                            ) : (
                                'Use My Current Location'
                            )}
                        </Button>

                        {/* Radius slider */}
                        <div className="grid gap-2">
                            <Label>
                                Allowed Radius:{' '}
                                <span className="font-semibold">{data.allowed_radius_meters}m</span>
                            </Label>
                            <input
                                type="range"
                                min={10}
                                max={500}
                                step={10}
                                value={data.allowed_radius_meters}
                                onChange={(e) => setData('allowed_radius_meters', Number(e.target.value))}
                                className="w-full accent-primary"
                            />
                            <p className="text-xs text-muted-foreground">
                                10m – 500m. The circle on the map updates in real time.
                            </p>
                            <InputError message={errors.allowed_radius_meters} />
                        </div>

                        {/* Coordinates readout */}
                        {hasPin ? (
                            <p className="text-xs text-muted-foreground">
                                Pinned: {(data.office_latitude as number).toFixed(6)},{' '}
                                {(data.office_longitude as number).toFixed(6)}
                            </p>
                        ) : (
                            <p className="text-sm text-amber-600 dark:text-amber-400">
                                No office location set. Click the map to drop a pin. Until set, users can check in from anywhere.
                            </p>
                        )}
                    </div>

                    <Button type="submit" disabled={processing}>
                        Save Settings
                    </Button>
                </form>
            </div>
        </>
    );
}

AdminSettings.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: AdminDashboardController.index.url() },
        { title: 'Settings', href: WorkScheduleController.edit.url() },
    ],
};
