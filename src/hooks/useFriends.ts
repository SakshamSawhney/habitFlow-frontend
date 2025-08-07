import { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { api } from '../api';
import toast from 'react-hot-toast';

export const useFriends = () => {
  const { friends, incomingRequests, loading, acceptRequest, declineRequest, removeFriendship, refetchAll } = useData();
  const [searchResults, setSearchResults] = useState<any[]>([]);

  const searchUsers = async (query: string) => {
    if (!query) {
      setSearchResults([]);
      return;
    }
    try {
      const { data } = await api.get(`/friends/search?q=${query}`);
      setSearchResults(data);
    } catch (error) {
      toast.error('Failed to search for users');
    }
  };

  const sendRequest = async (recipientId: string) => {
    try {
        await api.post('/friends/request', { recipientId });
        toast.success('Friend request sent!');
        refetchAll(); // Trigger a global refetch
    } catch (error: any) {
        toast.error(error.response?.data?.message || 'Failed to send request');
    }
  };

  return { friends, incomingRequests, searchResults, loading, searchUsers, sendRequest, acceptRequest, declineRequest, removeFriendship };
};
