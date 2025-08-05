import { useState, useEffect, useCallback } from 'react';
import { analyticsService } from '../api';
import toast from 'react-hot-toast';

export const useAnalytics = () => {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const fetchAnalytics = useCallback(async () => {
        setLoading(true);
        try {
            const response = await analyticsService.getAnalytics();
            setData(response.data);
        } catch (error) {
            toast.error("Failed to load analytics data.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchAnalytics();
    }, [fetchAnalytics]);

    return { data, loading, refetch: fetchAnalytics };
};