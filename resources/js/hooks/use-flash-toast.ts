import { useEffect } from 'react';
import { router } from '@inertiajs/react';
import { toast } from 'sonner';

/**
 * Listens for Inertia navigation events and fires a toast whenever
 * the backend sends a flash.success or flash.error message.
 *
 * Call this once in the top-level layout so it covers every page.
 */
export function useFlashToast() {
    useEffect(() => {
        const unsubscribe = router.on('success', (event) => {
            const flash = (event.detail.page.props as { flash?: { success?: string; error?: string } }).flash;
            if (flash?.success) toast.success(flash.success);
            if (flash?.error) toast.error(flash.error);
        });

        return () => unsubscribe();
    }, []);
}
