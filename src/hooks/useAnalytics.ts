import { useState, useEffect, useCallback } from 'react';
import { analyticsService } from '../api';
import toast from 'react-hot-toast';

/**
 * Custom React hook for fetching and managing analytics data
 * Provides data, loading state, and refetch capability
 */
export const useAnalytics = () => {
    // State for storing analytics data, initialized as null
    const [data, setData] = useState<any>(null);
    
    // State to track loading status, initialized as true
    const [loading, setLoading] = useState(true);

    /**
     * Memoized fetch function to retrieve analytics data
     * Wrapped in useCallback to prevent unnecessary recreations
     */
    const fetchAnalytics = useCallback(async () => {
        setLoading(true);
        try {
            // Fetch analytics data from the API service
            const response = await analyticsService.getAnalytics();
            
            // Update state with the received data
            setData(response.data);
        } catch (error) {
            // Display error notification if request fails
            toast.error("Failed to load analytics data.");
        } finally {
            // Ensure loading state is reset regardless of success/failure
            setLoading(false);
        }
    }, []); // Empty dependency array means this callback never changes

    /**
     * Effect hook to fetch data on component mount
     * Runs whenever fetchAnalytics reference changes (though it won't due to useCallback)
     */
    useEffect(() => {
        fetchAnalytics();
    }, [fetchAnalytics]);

    // Return the state and refetch function for consuming components
    return { 
        data,       // The analytics data (null until loaded)
        loading,    // Boolean indicating loading status
        refetch: fetchAnalytics  // Function to manually refresh data
    };
};
