import { useState, useEffect } from 'react';

export interface AnalyticsRecord {
    id: number;
    property_id: string;
    site_name: string;
    target_date: string;
    page_views: number;
    active_users: number;
    sessions: number;
}

export function useAnalytics(propertyId?: string) {
    const [data, setData] = useState<AnalyticsRecord[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchData() {
            try {
                setLoading(true);
                setError(null);

                const baseUrl = import.meta.env.VITE_API_BASE_URL;
                if (!baseUrl) {
                    throw new Error('VITE_API_BASE_URL is not configured');
                }

                const url = new URL(baseUrl);

                if (propertyId) {
                    url.searchParams.append('property_id', propertyId);
                }
                url.searchParams.append('limit', '30'); // 直近30日分

                const res = await fetch(url.toString());
                if (!res.ok) {
                    throw new Error(`HTTP error: ${res.status}`);
                }
                const json = await res.json();

                if (json.success) {
                    setData(json.data);
                } else {
                    setError(json.error || 'Failed to fetch data');
                }
            } catch (err: unknown) {
                setError(err instanceof Error ? err.message : 'Network error');
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, [propertyId]);

    return { data, loading, error };
}