// Utility functions for handling background configuration in spot components

/**
 * Generate background class based on Configuration.Background value
 * @param bgType - The background type from CMS (e.g., 'primary', 'red-500', 'transparent')
 * @returns Tailwind CSS background class or empty string
 */
export const getBackgroundClass = (bgType?: string | null): string => {
    if (!bgType || bgType === 'transparent') return '';
    return `bg-${bgType}`;
};

/**
 * Get complete background classes including conditional padding
 * @param bgType - The background type from CMS
 * @returns Complete class string for the wrapper div
 */
export const getBackgroundClasses = (bgType?: string | null): string => {
    const backgroundClass = getBackgroundClass(bgType);

    return `${backgroundClass} py-12`.trim();
};
