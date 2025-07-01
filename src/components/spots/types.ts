// Shared type definitions for spot components

export interface SpotConfiguration {
    Background: string | null;
}

// Base props that all spot components should extend
export interface SpotProps {
    Configuration: SpotConfiguration | null;
}
