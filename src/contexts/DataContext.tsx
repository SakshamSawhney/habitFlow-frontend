import { createContext, useState, useEffect, useCallback, ReactNode, useContext } from 'react';
import { useAuth } from '../hooks/useAuth';
import { api, habitService, analyticsService } from '../api';
import { Habit } from '../types';
import toast from 'react-hot-toast';

// Define the shape of the data and functions in our context
interface DataContextType {
    habits: Habit[];
    friends: any[];
    incomingRequests: any[];
    analyticsData: any;
    loading: boolean;
    addHabit: (habitData: { name: string; description?: string; color: string; }) => Promise<void>;
    toggleCompletion: (habitId: string, date: string) => Promise<void>;
    deleteHabit: (habitId: string) => Promise<void>;
    acceptRequest: (requestId: string) => Promise<void>;
    declineRequest: (requestId: string) => Promise<void>;
    removeFriendship: (friendshipId: string) => Promise<void>;
    refetchAll: () => void;
}

export const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider = ({ children }: { children: ReactNode }) => {
    const { user } = useAuth();
    const [habits, setHabits] = useState<Habit[]>([]);
    const [friends, setFriends] = useState<any[]>([]);
    const [incomingRequests, setIncomingRequests] = useState<any[]>([]);
    const [analyticsData, setAnalyticsData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const fetchAllData = useCallback(async () => {
        if (!user) {
            setLoading(false);
            return;
        }
        setLoading(true);
        try {
            const [habitsRes, friendsRes, analyticsRes] = await Promise.all([
                habitService.getHabits(),
                api.get('/friends'),
                analyticsService.getAnalytics()
            ]);
            setHabits(habitsRes.data);
            setFriends(friendsRes.data.friends);
            setIncomingRequests(friendsRes.data.incomingRequests);
            setAnalyticsData(analyticsRes.data);
        } catch (error) {
            toast.error("Failed to load app data. Please refresh.");
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        fetchAllData();
    }, [fetchAllData]);

    const addHabit = async (habitData: { name: string; description?: string; color: string; }) => {
        try {
            const { data: newHabit } = await habitService.createHabit(habitData);
            setHabits(prev => [...prev, newHabit]);
            toast.success('Habit added!');
            // Refetch analytics to update stats
            analyticsService.getAnalytics().then(res => setAnalyticsData(res.data));
        } catch (error) {
            toast.error('Failed to add habit');
        }
    };

    const toggleCompletion = async (habitId: string, date: string) => {
        try {
            const { data: updatedHabit } = await habitService.toggleCompletion(habitId, date);
            setHabits(prev => prev.map(h => h._id === habitId ? updatedHabit : h));
             analyticsService.getAnalytics().then(res => setAnalyticsData(res.data));
        } catch (error) {
            toast.error('Failed to update completion');
        }
    };

    const deleteHabit = async (habitId: string) => {
        try {
            await habitService.deleteHabit(habitId);
            setHabits(prev => prev.filter(h => h._id !== habitId));
            toast.success('Habit deleted!');
             analyticsService.getAnalytics().then(res => setAnalyticsData(res.data));
        } catch (error) {
            toast.error('Failed to delete habit');
        }
    };
    
    const acceptRequest = async (requestId: string) => {
        try {
            await api.put(`/friends/request/${requestId}`, { status: 'accepted' });
            toast.success('Friend request accepted!');
            fetchAllData();
        } catch (error) {
            toast.error('Failed to accept request');
        }
    };

    const declineRequest = async (requestId: string) => {
         try {
            await api.put(`/friends/request/${requestId}`, { status: 'declined' });
            toast.success('Friend request declined');
            fetchAllData();
        } catch (error) {
            toast.error('Failed to decline request');
        }
    };

    const removeFriendship = async (friendshipId: string) => {
        try {
            await api.delete(`/friends/${friendshipId}`);
            toast.success('Friendship removed');
            fetchAllData();
        } catch (error) {
            toast.error('Failed to remove friendship');
        }
    };

    const value = {
        habits,
        friends,
        incomingRequests,
        analyticsData,
        loading,
        addHabit,
        toggleCompletion,
        deleteHabit,
        acceptRequest,
        declineRequest,
        removeFriendship,
        refetchAll: fetchAllData
    };

    return (
        <DataContext.Provider value={value}>
            {children}
        </DataContext.Provider>
    );
};
