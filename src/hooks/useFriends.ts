import { useState, useEffect, useCallback } from 'react';
import { api } from '../api'; // Correctly import the 'api' instance
import toast from 'react-hot-toast';

export const useFriends = () => {
    const [friends, setFriends] = useState<any[]>([]);
    const [incomingRequests, setIncomingRequests] = useState<any[]>([]);
    const [sentRequests, setSentRequests] = useState<any[]>([]);
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchFriendsData = useCallback(async () => {
        setLoading(true);
        try {
            const { data } = await api.get('/friends'); // Use 'api' directly
            setFriends(data.friends);
            setIncomingRequests(data.incomingRequests);
            setSentRequests(data.sentRequests);
        } catch (error) {
            toast.error('Failed to load friends data');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchFriendsData();
    }, [fetchFriendsData]);

    const searchUsers = async (query: string) => {
        if (!query) {
            setSearchResults([]);
            return;
        }
        try {
            const { data } = await api.get(`/friends/search?q=${query}`); // Use 'api'
            setSearchResults(data);
        } catch (error) {
            toast.error('Failed to search for users');
        }
    };

    const sendRequest = async (recipientId: string) => {
        try {
            await api.post('/friends/request', { recipientId }); // Use 'api'
            toast.success('Friend request sent!');
            fetchFriendsData();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to send request');
        }
    };

    const acceptRequest = async (requestId: string) => {
        try {
            await api.put(`/friends/request/${requestId}`, { status: 'accepted' }); // Use 'api'
            toast.success('Friend request accepted!');
            fetchFriendsData();
        } catch (error) {
            toast.error('Failed to accept request');
        }
    };

    const declineRequest = async (requestId: string) => {
         try {
            await api.put(`/friends/request/${requestId}`, { status: 'declined' }); // Use 'api'
            toast.success('Friend request declined');
            fetchFriendsData();
        } catch (error) {
            toast.error('Failed to decline request');
        }
    };

    const removeFriendship = async (friendshipId: string) => {
        try {
            await api.delete(`/friends/${friendshipId}`); // Use 'api'
            toast.success('Friendship removed');
            fetchFriendsData();
        } catch (error) {
            toast.error('Failed to remove friendship');
        }
    };

    return {
        friends,
        incomingRequests,
        sentRequests,
        searchResults,
        loading,
        searchUsers,
        sendRequest,
        acceptRequest,
        declineRequest,
        removeFriendship
    };
};
