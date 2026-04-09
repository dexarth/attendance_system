import type { SVGAttributes } from 'react';

/**
 * Attendance system logo icon.
 * A rounded square with a bold checkmark cut out — represents attendance tracking.
 * Designed for fill-current usage; the rounded rect fills with the current color,
 * and the checkmark is cut out (evenodd rule), revealing the background.
 */
export default function AppLogoIcon(props: SVGAttributes<SVGElement>) {
    return (
        <svg {...props} viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M6 0H34A6 6 0 0 1 40 6V34A6 6 0 0 1 34 40H6A6 6 0 0 1 0 34V6A6 6 0 0 1 6 0Z M9 21L12 18L16 26L29 8L32 11L16 31Z"
            />
        </svg>
    );
}
